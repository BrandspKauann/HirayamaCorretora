import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtemp, mkdir, readFile, readdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
await mkdir(path.join(root, '.sites-runtime'), { recursive: true });
const runtime = await mkdtemp(path.join(root, '.sites-runtime', 'backend-tests-'));
for (const module of ['crm-types', 'crm-validation', 'crm-demo', 'crm-service']) {
  const source = await readFile(path.join(root, 'lib', `${module}.ts`), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText.replace(/from ['"]\.\/(crm-[\w-]+)['"]/g, "from './$1.mjs'");
  await writeFile(path.join(runtime, `${module}.mjs`), output);
}
const { CrmService } = await import(pathToFileURL(path.join(runtime, 'crm-service.mjs')).href);
const { validateData, assertSameOrigin, readJson } = await import(pathToFileURL(path.join(runtime, 'crm-validation.mjs')).href);
after(async () => { await rm(runtime, { recursive: true, force: true }); });

const migrationFiles = (await readdir(path.join(root, 'drizzle'))).filter(name => name.endsWith('.sql')).sort();
assert.ok(migrationFiles.length, 'Gere a migração com npm run db:generate antes dos testes.');
const migrations = await Promise.all(migrationFiles.map(file => readFile(path.join(root, 'drizzle', file), 'utf8')));
function database() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec('PRAGMA foreign_keys = ON');
  for (const sql of migrations) sqlite.exec(sql);
  const prepare = (sql, values = []) => ({
    bind: (...parameters) => prepare(sql, parameters),
    first: async () => sqlite.prepare(sql).get(...values) ?? null,
    all: async () => ({ results: sqlite.prepare(sql).all(...values), success: true }),
    execute: () => ({ results: sqlite.prepare(sql).all(...values), success: true }),
  });
  const d1 = { prepare, batch: async statements => {
    sqlite.exec('BEGIN IMMEDIATE');
    try { const results = statements.map(statement => statement.execute()); sqlite.exec('COMMIT'); return results; }
    catch (error) { sqlite.exec('ROLLBACK'); throw error; }
  } };
  return { sqlite, d1, service: owner => new CrmService(d1, owner) };
}
const user = { name: 'Teste', email: 'teste@exemplo.invalid' };
const contactData = { name: 'Contato Teste', company: 'Empresa Teste', email: '', phone: '', product: 'Plano de saúde', source: 'Manual', status: 'Lead', notes: '', consent: false };
const dealData = contactId => ({ title: 'Plano empresarial', contactId, product: 'Plano de saúde', stage: 'Diagnóstico', value: 125000, expectedClose: '2026-12-10', priority: 'Alta', notes: '' });

test('validação rejeita datas impossíveis, valores fracionários, campos e vigência invertida', () => {
  assert.throws(() => validateData('tasks', { title: 'Retorno', dueDate: '2026-02-30', type: 'Retorno' }), /data válida/);
  assert.throws(() => validateData('deals', { ...dealData('a'), value: 2.5 }), /centavos inteiros/);
  assert.throws(() => validateData('contacts', { ...contactData, ownerId: 'outro' }), /campos desconhecidos/);
  assert.throws(() => validateData('policies', { number: '01', contactId: 'a', product: 'Plano de saúde', insurer: 'Teste', premium: 100, startDate: '2026-12-10', endDate: '2026-12-01' }), /vigência/);
  assert.equal(validateData('tasks', { title: 'Retorno', dueDate: '2028-02-29', type: 'Retorno', contactId: '' }).contactId, '');
});
test('CSRF exige Origin exato, JSON e corpo limitado mesmo sem Content-Length', async () => {
  assert.throws(() => assertSameOrigin(new Request('https://crm.example/api/crm', { method: 'POST', headers: { origin: 'https://evil.example', 'content-type': 'application/json' }, body: '{}' })), error => error.status === 403);
  assert.throws(() => assertSameOrigin(new Request('https://crm.example/api/crm', { method: 'POST', body: '{}' })), error => error.status === 403);
  assertSameOrigin(new Request('https://crm.example/api/crm', { method: 'POST', headers: { origin: 'https://crm.example', 'content-type': 'application/json' }, body: '{}' }));
  await assert.rejects(() => readJson(new Request('https://crm.example/api/crm', { method: 'POST', body: 'x'.repeat(33000) })), error => error.status === 413);
  await assert.rejects(() => readJson(new Request('https://crm.example/api/crm', { method: 'POST', body: 'invalid' })), error => error.status === 400);
});
test('CRUD persiste, isola contas e impede vínculos de outro proprietário até no SQL', async () => {
  const db = database(), a = db.service('a'), b = db.service('b');
  const contact = await a.create('contacts', contactData);
  assert.equal((await a.snapshot(user)).contacts.length, 1);
  assert.equal((await b.snapshot(user)).contacts.length, 0);
  await assert.rejects(() => b.update('contacts', contact.id, contact.version, { name: 'Invasão' }), error => error.status === 404);
  await assert.rejects(() => b.create('deals', dealData(contact.id)), error => error.status === 400);
  assert.throws(() => db.sqlite.prepare('INSERT INTO deals (id,owner_id,version,created_at,updated_at,mutation_id,title,contact_id,product,stage,value,expected_close,priority,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run('x', 'b', 1, 'now', 'now', 'mutation', 'Teste', contact.id, 'Plano de saúde', 'Novo lead', 0, '2026-12-01', 'Média', ''), /FOREIGN KEY/);
  const updated = await a.update('contacts', contact.id, 1, { name: 'Nome atualizado' });
  assert.equal(updated.version, 2); assert.equal(updated.name, 'Nome atualizado');
  await a.remove('contacts', contact.id, 2);
  assert.equal((await a.snapshot(user)).contacts.length, 0);
  assert.equal((await a.snapshot(user)).audit.length, 3);
  db.sqlite.close();
});
test('concorrência otimista rejeita escrita perdida e não registra auditoria falsa', async () => {
  const db = database(), a = db.service('a');
  const contact = await a.create('contacts', contactData);
  const results = await Promise.allSettled([a.update('contacts', contact.id, 1, { name: 'A' }), a.update('contacts', contact.id, 1, { name: 'B' })]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.find(result => result.status === 'rejected').reason.status, 409);
  const snapshot = await a.snapshot(user);
  assert.equal(snapshot.contacts[0].version, 2); assert.equal(snapshot.audit.length, 2);
  db.sqlite.close();
});
test('contato vinculado não pode ser removido e tarefas podem ficar sem contato', async () => {
  const db = database(), a = db.service('a');
  const contact = await a.create('contacts', contactData);
  const deal = await a.create('deals', dealData(contact.id));
  await assert.rejects(() => a.remove('contacts', contact.id, 1), error => error.status === 409);
  assert.equal((await a.snapshot(user)).audit.length, 2);
  const task = await a.create('tasks', { title: 'Preparar agenda', contactId: '', dueDate: '2026-12-01', type: 'Retorno' });
  assert.equal(task.contactId, '');
  await a.remove('deals', deal.id, 1); await a.remove('contacts', contact.id, 1);
  assert.equal((await a.snapshot(user)).contacts.length, 0);
  db.sqlite.close();
});
test('falha no audit reverte mutação na mesma transação', async () => {
  const db = database(), a = db.service('a');
  db.sqlite.exec("CREATE TRIGGER fail_audit BEFORE INSERT ON audit_events BEGIN SELECT RAISE(ABORT, 'audit unavailable'); END");
  await assert.rejects(() => a.create('contacts', contactData), /audit unavailable/);
  assert.equal((await a.snapshot(user)).contacts.length, 0);
  await assert.rejects(() => a.createDemo(), /audit unavailable/);
  const empty = await a.snapshot(user);
  assert.equal(empty.contacts.length + empty.deals.length + empty.policies.length + empty.tasks.length, 0);
  assert.equal(db.sqlite.prepare('SELECT COUNT(*) AS count FROM demo_runs').get().count, 0);
  db.sqlite.close();
});
test('demonstração é atômica, isolada, explícita e repetição/concorrrência não duplica dados', async () => {
  const db = database(), a = db.service('a'), b = db.service('b');
  assert.equal((await a.snapshot(user)).contacts.length, 0);
  const results = await Promise.allSettled([a.createDemo(), a.createDemo()]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.find(result => result.status === 'rejected').reason.status, 409);
  const snapshot = await a.snapshot(user);
  assert.equal(snapshot.contacts.length, 8); assert.equal(snapshot.deals.length, 9); assert.equal(snapshot.policies.length, 3); assert.equal(snapshot.tasks.length, 5);
  assert.equal(snapshot.audit.length, 1); assert.ok(snapshot.contacts.every(contact => contact.notes.includes('fictício')));
  assert.equal((await b.snapshot(user)).contacts.length, 0);
  await assert.rejects(() => a.createDemo(), error => error.status === 409);
  await b.create('contacts', contactData);
  await assert.rejects(() => b.createDemo(), error => error.status === 409);
  assert.equal((await b.snapshot(user)).contacts.length, 1);
  db.sqlite.close();
});

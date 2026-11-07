import assert from 'node:assert/strict';

// Deliberately restricted to disposable records in a loopback development CRM.
const origin = new URL(process.argv[2] ?? 'http://127.0.0.1:5186').origin;
if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(origin).hostname)) throw new Error('QA HTTP permitido apenas no ambiente local.');
let cookie = '';
async function api(method, body, expected = 200) {
  const response = await fetch(`${origin}/api/crm`, { method, headers: { ...(cookie ? { Cookie: cookie } : {}), ...(body ? { Origin: origin, 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const result = await response.json();
  assert.equal(response.status, expected, `${method} ${JSON.stringify(body?.entity)}: ${JSON.stringify(result)}`);
  return result;
}
await api('GET', undefined, 401);
const login = await fetch(`${origin}/signin-with-chatgpt?return_to=/`, { redirect: 'manual' });
cookie = login.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
assert.ok(cookie, 'O mock local deve produzir cookie de desenvolvimento.');
const first = await api('GET');
const created = [];
async function create(entity, data) { const { record } = await api('POST', { entity, data }, 201); created.push({ entity, record }); return record; }
try {
  const contact = await create('contacts', { name: `Contato QA ${Date.now()}`, company: 'Empresa fictícia de teste', email: 'qa@example.invalid', product: 'Seguro de vida', consent: false });
  const update = await api('PATCH', { entity: 'contacts', id: contact.id, version: contact.version, data: { company: 'Persistência verificada' } });
  created[0].record = update.record;
  assert.equal(update.record.version, 2);
  await api('PATCH', { entity: 'contacts', id: contact.id, version: 1, data: { name: 'Conflito' } }, 409);
  const deal = await create('deals', { title: 'Oportunidade QA', contactId: contact.id, product: 'Seguro de vida', stage: 'Diagnóstico', value: 145099, expectedClose: '2026-12-10' });
  await create('policies', { number: 'QA-LOCAL', contactId: contact.id, product: 'Seguro de vida', insurer: 'Seguradora fictícia', premium: 120000, commissionRate: 12, startDate: '2026-01-01', endDate: '2027-01-01' });
  const task = await create('tasks', { title: 'Retorno QA', contactId: contact.id, dueDate: '2026-12-09', type: 'Retorno' });
  const completed = await api('PATCH', { entity: 'tasks', id: task.id, version: 1, data: { done: true } });
  created[3].record = completed.record;
  assert.equal(completed.record.done, true);
  await api('DELETE', { entity: 'contacts', id: contact.id, version: 2 }, 409);
  await api('POST', { entity: 'deals', data: { title: 'Inválido', contactId: contact.id, product: 'Seguro de vida', value: -1, expectedClose: '2026-02-31' } }, 400);
  const blocked = await fetch(`${origin}/api/crm`, { method: 'POST', headers: { Cookie: cookie, Origin: 'https://example.invalid', 'Content-Type': 'application/json' }, body: JSON.stringify({ entity: 'demo' }) });
  assert.equal(blocked.status, 403);
  const snapshot = await api('GET');
  assert.equal(snapshot.contacts.find(item => item.id === contact.id)?.company, 'Persistência verificada');
  assert.equal(snapshot.deals.find(item => item.id === deal.id)?.value, 145099);
  assert.ok(snapshot.audit.some(item => item.entityId === contact.id));
} finally {
  for (const { entity, record } of created.reverse()) await api('DELETE', { entity, id: record.id, version: record.version });
}
const after = await api('GET');
for (const entity of ['contacts', 'deals', 'policies', 'tasks']) assert.equal(after[entity].length, first[entity].length);
console.log('QA HTTP passou: autenticação, CRUD, persistência, centavos, conflito de versão, vínculos, validação, origem e auditoria. Registros de teste removidos.');

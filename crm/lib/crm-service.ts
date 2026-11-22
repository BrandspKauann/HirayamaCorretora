import type { CrmRecord, CrmSnapshot, Entity } from './crm-types';
import { CrmError, validateData } from './crm-validation';
import { demoData } from './crm-demo';

type Row = Record<string, unknown>;
const columns: Record<Entity, Record<string, string>> = {
  contacts: { name: 'name', company: 'company', email: 'email', phone: 'phone', product: 'product', source: 'source', status: 'status', notes: 'notes', consent: 'consent' },
  deals: { title: 'title', contactId: 'contact_id', product: 'product', stage: 'stage', value: 'value', expectedClose: 'expected_close', priority: 'priority', notes: 'notes' },
  policies: { number: 'number', contactId: 'contact_id', product: 'product', insurer: 'insurer', premium: 'premium', commissionRate: 'commission_rate', startDate: 'start_date', endDate: 'end_date', status: 'status', notes: 'notes' },
  tasks: { title: 'title', contactId: 'contact_id', dueDate: 'due_date', type: 'type', done: 'done', notes: 'notes' },
};
const labels: Record<Entity, string> = { contacts: 'Contato', deals: 'Oportunidade', policies: 'Apólice', tasks: 'Atividade' };
const baseMap: Record<string, string> = { id: 'id', version: 'version', createdAt: 'created_at', updatedAt: 'updated_at' };
function decode(entity: Entity, row: Row): CrmRecord {
  const result: Row = {};
  for (const [key, column] of Object.entries({ ...baseMap, ...columns[entity] })) result[key] = row[column];
  if (entity === 'contacts') result.consent = Boolean(row.consent);
  if (entity === 'tasks') { result.done = Boolean(row.done); result.contactId = row.contact_id ?? ''; }
  return result as unknown as CrmRecord;
}
function boundValue(key: string, value: unknown) { return key === 'contactId' && value === '' ? null : typeof value === 'boolean' ? Number(value) : value; }
const nameOf = (data: Row) => String(data.name ?? data.title ?? data.number ?? '').slice(0, 200);

export class CrmService {
  constructor(private db: D1Database, private ownerId: string) {}
  private prepare(sql: string, values: unknown[] = []) { return this.db.prepare(sql).bind(...values); }
  private async find(entity: Entity, id: string): Promise<Row> {
    const row = await this.prepare(`SELECT * FROM ${entity} WHERE id = ? AND owner_id = ?`, [id, this.ownerId]).first<Row>();
    if (!row) throw new CrmError(404, 'Cadastro não encontrado.');
    return row;
  }
  private async verifyContact(entity: Entity, data: Row) {
    if (entity === 'contacts' || !data.contactId) return;
    const found = await this.prepare('SELECT id FROM contacts WHERE id = ? AND owner_id = ?', [data.contactId, this.ownerId]).first();
    if (!found) throw new CrmError(400, 'Selecione um contato válido do seu CRM.');
  }
  private insertStatement(entity: Entity, id: string, data: Row, now: string, mutationId: string, demoGuard = false) {
    const entries = Object.entries(columns[entity]);
    const names = ['id', 'owner_id', 'version', 'created_at', 'updated_at', 'mutation_id', ...entries.map(([, col]) => col)];
    const values = [id, this.ownerId, 1, now, now, mutationId, ...entries.map(([key]) => boundValue(key, data[key]))];
    const placeholders = names.map(() => '?').join(', ');
    return this.prepare(`INSERT INTO ${entity} (${names.join(', ')}) ${demoGuard ? `SELECT ${placeholders} WHERE EXISTS (SELECT 1 FROM demo_runs WHERE owner_id = ? AND mutation_id = ?)` : `VALUES (${placeholders})`} RETURNING *`, [...values, ...(demoGuard ? [this.ownerId, mutationId] : [])]);
  }
  private auditStatement(entity: Entity, id: string, action: string, data: Row, now: string, mutationId: string) {
    return this.prepare(`INSERT INTO audit_events (id,owner_id,entity,entity_id,action,summary,created_at) SELECT ?,?,?,?,?,?,? FROM ${entity} WHERE id = ? AND owner_id = ? AND mutation_id = ?`, [crypto.randomUUID(), this.ownerId, entity, id, action, `${labels[entity]} ${action}: ${nameOf(data)}`, now, id, this.ownerId, mutationId]);
  }
  async snapshot(user: { name: string; email: string }): Promise<CrmSnapshot> {
    const entities = ['contacts', 'deals', 'policies', 'tasks'] as const;
    const results = await this.db.batch([
      ...entities.map(entity => this.prepare(`SELECT * FROM ${entity} WHERE owner_id = ? ORDER BY created_at DESC, id`, [this.ownerId])),
      this.prepare('SELECT id,entity,entity_id AS entityId,action,summary,created_at AS createdAt FROM audit_events WHERE owner_id = ? ORDER BY created_at DESC, id DESC LIMIT 80', [this.ownerId]),
    ]);
    return {
      user,
      contacts: (results[0].results ?? []).map(row => decode('contacts', row as Row)) as CrmSnapshot['contacts'],
      deals: (results[1].results ?? []).map(row => decode('deals', row as Row)) as CrmSnapshot['deals'],
      policies: (results[2].results ?? []).map(row => decode('policies', row as Row)) as CrmSnapshot['policies'],
      tasks: (results[3].results ?? []).map(row => decode('tasks', row as Row)) as CrmSnapshot['tasks'],
      audit: (results[4].results ?? []) as unknown as CrmSnapshot['audit'],
    };
  }
  async create(entity: Entity, supplied: unknown): Promise<CrmRecord> {
    const data = validateData(entity, supplied);
    await this.verifyContact(entity, data);
    const id = crypto.randomUUID(), now = new Date().toISOString(), mutationId = crypto.randomUUID();
    const result = await this.db.batch([this.insertStatement(entity, id, data, now, mutationId), this.auditStatement(entity, id, 'criado', data, now, mutationId)]);
    return decode(entity, result[0].results[0] as Row);
  }
  async update(entity: Entity, id: string, version: number, supplied: unknown): Promise<CrmRecord> {
    const row = await this.find(entity, id);
    if (row.version !== version) throw new CrmError(409, 'Este cadastro foi alterado em outra janela. Atualize a página e tente novamente.');
    const existing = decode(entity, row) as unknown as Row;
    const data = validateData(entity, supplied, existing);
    await this.verifyContact(entity, data);
    const now = new Date().toISOString(), mutationId = crypto.randomUUID();
    const entries = Object.entries(columns[entity]);
    const statement = this.prepare(`UPDATE ${entity} SET ${entries.map(([, column]) => `${column} = ?`).join(', ')}, version = version + 1, updated_at = ?, mutation_id = ? WHERE id = ? AND owner_id = ? AND version = ? RETURNING *`, [...entries.map(([key]) => boundValue(key, data[key])), now, mutationId, id, this.ownerId, version]);
    const result = await this.db.batch([statement, this.auditStatement(entity, id, 'atualizado', data, now, mutationId)]);
    if (!result[0].results.length) throw new CrmError(409, 'Este cadastro foi alterado em outra janela. Atualize a página e tente novamente.');
    return decode(entity, result[0].results[0] as Row);
  }
  async remove(entity: Entity, id: string, version: number) {
    const row = await this.find(entity, id);
    if (row.version !== version) throw new CrmError(409, 'Este cadastro foi alterado. Atualize a página antes de excluir.');
    if (entity === 'contacts') {
      const used = await this.prepare('SELECT 1 AS used FROM deals WHERE contact_id = ? AND owner_id = ? UNION ALL SELECT 1 FROM policies WHERE contact_id = ? AND owner_id = ? UNION ALL SELECT 1 FROM tasks WHERE contact_id = ? AND owner_id = ? LIMIT 1', [id, this.ownerId, id, this.ownerId, id, this.ownerId]).first();
      if (used) throw new CrmError(409, 'Este contato possui oportunidades, apólices ou atividades. Exclua ou desvincule esses registros antes.');
    }
    const now = new Date().toISOString();
    const audit = this.prepare(`INSERT INTO audit_events (id,owner_id,entity,entity_id,action,summary,created_at) SELECT ?,?,?,?,?,?,? FROM ${entity} WHERE id = ? AND owner_id = ? AND version = ?`, [crypto.randomUUID(), this.ownerId, entity, id, 'excluído', `${labels[entity]} excluído: ${nameOf(row)}`, now, id, this.ownerId, version]);
    const result = await this.db.batch([audit, this.prepare(`DELETE FROM ${entity} WHERE id = ? AND owner_id = ? AND version = ? RETURNING id`, [id, this.ownerId, version])]);
    if (!result[1].results.length) throw new CrmError(409, 'Este cadastro foi alterado. Atualize a página antes de excluir.');
  }
  async createDemo() {
    const now = new Date().toISOString(), mutationId = crypto.randomUUID();
    const guard = this.prepare('INSERT INTO demo_runs (owner_id,mutation_id,created_at) SELECT ?,?,? WHERE NOT EXISTS (SELECT 1 FROM contacts WHERE owner_id = ?) AND NOT EXISTS (SELECT 1 FROM deals WHERE owner_id = ?) AND NOT EXISTS (SELECT 1 FROM policies WHERE owner_id = ?) AND NOT EXISTS (SELECT 1 FROM tasks WHERE owner_id = ?) ON CONFLICT(owner_id) DO NOTHING RETURNING mutation_id', [this.ownerId, mutationId, now, this.ownerId, this.ownerId, this.ownerId, this.ownerId]);
    const records = demoData();
    const inserts = records.map(record => this.insertStatement(record.entity, record.id, validateData(record.entity, record.data), now, mutationId, true));
    const audit = this.prepare('INSERT INTO audit_events (id,owner_id,entity,entity_id,action,summary,created_at) SELECT ?,?,?,?,?,?,? FROM demo_runs WHERE owner_id = ? AND mutation_id = ?', [crypto.randomUUID(), this.ownerId, 'demo', mutationId, 'criado', 'Demonstração carregada com dados inteiramente fictícios.', now, this.ownerId, mutationId]);
    const result = await this.db.batch([guard, ...inserts, audit]);
    if (!result[0].results.length) throw new CrmError(409, 'A demonstração pode ser carregada uma vez e apenas em um CRM vazio.');
  }
}

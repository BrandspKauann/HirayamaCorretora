import { sqliteTable, text, integer, real, index, uniqueIndex, foreignKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

const common = () => ({
  id: text('id').primaryKey(), ownerId: text('owner_id').notNull(), version: integer('version').notNull().default(1),
  createdAt: text('created_at').notNull(), updatedAt: text('updated_at').notNull(), mutationId: text('mutation_id').notNull(),
});

export const contacts = sqliteTable('contacts', {
  ...common(), name: text('name').notNull(), company: text('company').notNull().default(''),
  email: text('email').notNull().default(''), phone: text('phone').notNull().default(''),
  product: text('product').notNull(), source: text('source').notNull().default('Manual'),
  status: text('status').notNull().default('Lead'), notes: text('notes').notNull().default(''),
  consent: integer('consent', { mode: 'boolean' }).notNull().default(false),
}, table => [uniqueIndex('contacts_id_owner').on(table.id, table.ownerId), index('contacts_owner_status').on(table.ownerId, table.status)]);

export const deals = sqliteTable('deals', {
  ...common(), title: text('title').notNull(), contactId: text('contact_id').notNull(), product: text('product').notNull(),
  stage: text('stage').notNull(), value: integer('value').notNull().default(0), expectedClose: text('expected_close').notNull(),
  priority: text('priority').notNull().default('Média'), notes: text('notes').notNull().default(''),
}, table => [index('deals_owner_stage').on(table.ownerId, table.stage), foreignKey({ columns: [table.contactId, table.ownerId], foreignColumns: [contacts.id, contacts.ownerId] }).onDelete('restrict'), check('deals_value_nonnegative', sql`${table.value} >= 0`)]);

export const policies = sqliteTable('policies', {
  ...common(), number: text('number').notNull(), contactId: text('contact_id').notNull(), product: text('product').notNull(),
  insurer: text('insurer').notNull(), premium: integer('premium').notNull(), commissionRate: real('commission_rate').notNull().default(0),
  startDate: text('start_date').notNull(), endDate: text('end_date').notNull(), status: text('status').notNull().default('Ativa'), notes: text('notes').notNull().default(''),
}, table => [index('policies_owner_expiry').on(table.ownerId, table.endDate), foreignKey({ columns: [table.contactId, table.ownerId], foreignColumns: [contacts.id, contacts.ownerId] }).onDelete('restrict'), check('policies_premium_nonnegative', sql`${table.premium} >= 0`), check('policies_commission_range', sql`${table.commissionRate} >= 0 AND ${table.commissionRate} <= 100`), check('policies_date_order', sql`${table.endDate} >= ${table.startDate}`)]);

export const tasks = sqliteTable('tasks', {
  ...common(), title: text('title').notNull(), contactId: text('contact_id'), dueDate: text('due_date').notNull(),
  type: text('type').notNull(), done: integer('done', { mode: 'boolean' }).notNull().default(false), notes: text('notes').notNull().default(''),
}, table => [index('tasks_owner_due').on(table.ownerId, table.done, table.dueDate), foreignKey({ columns: [table.contactId, table.ownerId], foreignColumns: [contacts.id, contacts.ownerId] }).onDelete('restrict')]);

export const auditEvents = sqliteTable('audit_events', {
  id: text('id').primaryKey(), ownerId: text('owner_id').notNull(), entity: text('entity').notNull(), entityId: text('entity_id').notNull(),
  action: text('action').notNull(), summary: text('summary').notNull(), createdAt: text('created_at').notNull(),
}, table => [index('audit_owner_time').on(table.ownerId, table.createdAt)]);

export const demoRuns = sqliteTable('demo_runs', {
  ownerId: text('owner_id').primaryKey(), mutationId: text('mutation_id').notNull(), createdAt: text('created_at').notNull(),
});

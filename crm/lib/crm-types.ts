export const PRODUCTS = ['Plano de saúde', 'Seguro de crédito', 'Benefícios corporativos', 'Consórcio', 'Seguro auto', 'Seguro de vida', 'Diagnóstico'] as const;
export const STAGES = ['Novo lead', 'Diagnóstico', 'Cotação', 'Proposta', 'Negociação', 'Ganho', 'Perdido'] as const;
export type Product = typeof PRODUCTS[number];
export type Stage = typeof STAGES[number];
export type Entity = 'contacts' | 'deals' | 'policies' | 'tasks';
export interface BaseRecord { id: string; version: number; createdAt: string; updatedAt: string }
export interface Contact extends BaseRecord { name: string; company: string; email: string; phone: string; product: Product; source: string; status: 'Lead' | 'Cliente' | 'Inativo'; notes: string; consent: boolean }
export interface Deal extends BaseRecord { title: string; contactId: string; product: Product; stage: Stage; value: number; expectedClose: string; priority: 'Alta' | 'Média' | 'Baixa'; notes: string }
export interface Policy extends BaseRecord { number: string; contactId: string; product: Product; insurer: string; premium: number; commissionRate: number; startDate: string; endDate: string; status: 'Ativa' | 'Renovada' | 'Cancelada'; notes: string }
export interface Task extends BaseRecord { title: string; contactId: string; dueDate: string; type: 'Ligação' | 'Reunião' | 'E-mail' | 'Retorno'; done: boolean; notes: string }
export interface AuditRecord { id: string; entity: string; entityId: string; action: string; summary: string; createdAt: string }
export interface CrmSnapshot { user: { name: string; email: string }; contacts: Contact[]; deals: Deal[]; policies: Policy[]; tasks: Task[]; audit: AuditRecord[] }
export type CrmRecord = Contact | Deal | Policy | Task;
export function money(cents: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(cents / 100); }
export function today() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }

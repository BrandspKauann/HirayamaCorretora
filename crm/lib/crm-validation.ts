import { z } from 'zod';
import { PRODUCTS, STAGES, type Entity } from './crm-types';

export class CrmError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = 'CrmError'; }
}
const text = (max: number) => z.string().trim().max(max, `Use no máximo ${max} caracteres.`);
const required = (max: number) => text(max).min(1, 'Preencha os campos obrigatórios.');
export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe uma data válida.').refine(value => {
  const parsed = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, 'Informe uma data válida.');
const cents = z.number().int('O valor deve ser informado em centavos inteiros.').min(0, 'O valor não pode ser negativo.').max(100_000_000_000, 'O valor excede o limite permitido.');
const note = text(5000).default('');
const contactId = required(100);
export const schemas = {
  contacts: z.object({
    name: required(160), company: text(200).default(''),
    email: text(254).refine(v => v === '' || z.string().email().safeParse(v).success, 'Informe um e-mail válido.').default(''),
    phone: text(40).default(''), product: z.enum(PRODUCTS), source: text(100).default('Manual'),
    status: z.enum(['Lead', 'Cliente', 'Inativo']).default('Lead'), notes: note, consent: z.boolean().default(false),
  }).strict(),
  deals: z.object({ title: required(200), contactId, product: z.enum(PRODUCTS), stage: z.enum(STAGES).default('Novo lead'), value: cents.default(0), expectedClose: isoDate, priority: z.enum(['Alta', 'Média', 'Baixa']).default('Média'), notes: note }).strict(),
  policies: z.object({ number: required(100), contactId, product: z.enum(PRODUCTS), insurer: required(160), premium: cents, commissionRate: z.number().min(0, 'A comissão deve estar entre 0 e 100%.').max(100, 'A comissão deve estar entre 0 e 100%.').default(0), startDate: isoDate, endDate: isoDate, status: z.enum(['Ativa', 'Renovada', 'Cancelada']).default('Ativa'), notes: note }).strict(),
  tasks: z.object({ title: required(200), contactId: text(100).default(''), dueDate: isoDate, type: z.enum(['Ligação', 'Reunião', 'E-mail', 'Retorno']).default('Retorno'), done: z.boolean().default(false), notes: note }).strict(),
};
export const mutationEnvelope = z.object({ entity: z.enum(['contacts', 'deals', 'policies', 'tasks']), id: required(100), version: z.number().int().min(1), data: z.record(z.unknown()).optional() }).strict();

export function validationMessage(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) return 'Revise os campos informados.';
  if (issue.message.startsWith('O valor ')) return issue.message;
  if (issue.code === 'invalid_type') return 'Revise os campos obrigatórios e seus formatos.';
  if (issue.code === 'invalid_enum_value' || issue.code === 'invalid_literal') return 'Selecione uma opção válida.';
  if (issue.code === 'unrecognized_keys') return 'Há campos desconhecidos no cadastro.';
  if (issue.message.startsWith('Number must')) return 'Informe um número válido.';
  return issue.message;
}

export function validateData(entity: Entity, value: unknown, existing?: Record<string, unknown>): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new CrmError(400, 'Dados inválidos.');
  const schema = schemas[entity];
  const keys = Object.keys(schema.shape);
  const supplied = value as Record<string, unknown>;
  if (Object.keys(supplied).some(key => !keys.includes(key))) throw new CrmError(400, 'Há campos desconhecidos no cadastro.');
  const merged = existing ? { ...Object.fromEntries(keys.map(key => [key, existing[key]])), ...supplied } : supplied;
  const result = schema.safeParse(merged);
  if (!result.success) throw new CrmError(400, validationMessage(result.error));
  const data = result.data as Record<string, unknown>;
  if (entity === 'policies' && String(data.endDate) < String(data.startDate)) throw new CrmError(400, 'O fim da vigência deve ser igual ou posterior ao início.');
  return data;
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) throw new CrmError(403, 'Esta ação deve ser realizada dentro do CRM.');
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new CrmError(415, 'Envie os dados em JSON.');
}

export async function readJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > 32768) throw new CrmError(413, 'Cadastro muito grande. Reduza o texto.');
  const reader = request.body?.getReader();
  if (!reader) throw new CrmError(400, 'Envie os dados do cadastro.');
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 32768) { await reader.cancel(); throw new CrmError(413, 'Cadastro muito grande. Reduza o texto.'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new CrmError(400, 'JSON inválido.'); }
}

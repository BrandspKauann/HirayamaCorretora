import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { CrmService } from '../../../lib/crm-service';
import { CrmError, assertSameOrigin, mutationEnvelope, readJson, validationMessage } from '../../../lib/crm-validation';
import type { Entity } from '../../../lib/crm-types';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store, private', 'Vary': 'Cookie', 'X-Content-Type-Options': 'nosniff' } });
async function context() {
  const user = await getChatGPTUser();
  if (!user) throw new CrmError(401, 'Entre na sua conta para acessar o CRM.');
  if (!env.DB) throw new CrmError(503, 'O banco do CRM ainda não está disponível.');
  return { user, service: new CrmService(env.DB, user.userId) };
}
async function handle(run: () => Promise<Response>) {
  try { return await run(); }
  catch (error) {
    if (error instanceof CrmError) return json({ error: error.message }, error.status);
    if (error instanceof z.ZodError) return json({ error: validationMessage(error) }, 400);
    const message = error instanceof Error ? error.message : '';
    if (/FOREIGN KEY constraint failed/i.test(message)) return json({ error: 'Este registro está vinculado a outro cadastro. Atualize a página e revise os vínculos.' }, 409);
    console.error('CRM request failed', error instanceof Error ? error.name : 'UnknownError');
    return json({ error: 'Não foi possível concluir a operação. Tente novamente.' }, 500);
  }
}
export async function GET() {
  return handle(async () => { const { user, service } = await context(); return json(await service.snapshot({ name: user.displayName, email: user.email })); });
}
export async function POST(request: Request) {
  return handle(async () => {
    const { service } = await context(); assertSameOrigin(request);
    const body = z.object({ entity: z.enum(['contacts', 'deals', 'policies', 'tasks', 'demo']), data: z.record(z.unknown()).optional() }).strict().parse(await readJson(request));
    if (body.entity === 'demo') { await service.createDemo(); return json({ ok: true }, 201); }
    return json({ record: await service.create(body.entity as Entity, body.data) }, 201);
  });
}
export async function PATCH(request: Request) {
  return handle(async () => {
    const { service } = await context(); assertSameOrigin(request);
    const body = mutationEnvelope.parse(await readJson(request));
    return json({ record: await service.update(body.entity, body.id, body.version, body.data) });
  });
}
export async function DELETE(request: Request) {
  return handle(async () => {
    const { service } = await context(); assertSameOrigin(request);
    const body = mutationEnvelope.parse(await readJson(request));
    await service.remove(body.entity, body.id, body.version); return json({ ok: true });
  });
}

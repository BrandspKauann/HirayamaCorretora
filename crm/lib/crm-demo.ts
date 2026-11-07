import { today, type Entity } from './crm-types';

export function demoData(): { entity: Entity; id: string; data: Record<string, unknown> }[] {
  const prefix = crypto.randomUUID();
  const ids = Array.from({ length: 8 }, (_, i) => `${prefix}-contact-${i}`);
  const relative = (offset: number) => {
    const date = new Date(`${today()}T12:00:00Z`); date.setUTCDate(date.getUTCDate() + offset); return date.toISOString().slice(0, 10);
  };
  const contacts = [
    { name: 'Mariana Costa', company: 'Aurora Tecnologia', product: 'Plano de saúde', status: 'Cliente', source: 'Site Hirayama' },
    { name: 'Ricardo Almeida', company: 'Almeida Logística', product: 'Seguro de crédito', status: 'Lead', source: 'Indicação' },
    { name: 'Camila Santos', company: 'Estúdio Vértice', product: 'Benefícios corporativos', status: 'Lead', source: 'Consultoria VR' },
    { name: 'Fernando Lima', company: 'Lima & Associados', product: 'Consórcio', status: 'Cliente', source: 'Consórcio Platinum' },
    { name: 'Beatriz Oliveira', company: 'Café Origem', product: 'Seguro de vida', status: 'Lead', source: 'Site Hirayama' },
    { name: 'Lucas Ferreira', company: 'Ferreira Engenharia', product: 'Seguro auto', status: 'Cliente', source: 'Indicação' },
    { name: 'Ana Rodrigues', company: 'Grupo Horizonte', product: 'Plano de saúde', status: 'Lead', source: 'Saúde Internacional' },
    { name: 'Pedro Martins', company: 'Martins Indústria', product: 'Seguro de crédito', status: 'Lead', source: 'Site Hirayama' },
  ];
  const deals = [
    { title: 'Saúde empresarial · 42 vidas', contact: 0, product: 'Plano de saúde', stage: 'Ganho', value: 3840000, priority: 'Alta', offset: -12 },
    { title: 'Proteção de recebíveis', contact: 1, product: 'Seguro de crédito', stage: 'Negociação', value: 2450000, priority: 'Alta', offset: 4 },
    { title: 'Benefícios · equipe criativa', contact: 2, product: 'Benefícios corporativos', stage: 'Proposta', value: 864000, priority: 'Média', offset: 7 },
    { title: 'Consórcio imóvel comercial', contact: 3, product: 'Consórcio', stage: 'Ganho', value: 1280000, priority: 'Média', offset: -8 },
    { title: 'Seguro de vida empresarial', contact: 4, product: 'Seguro de vida', stage: 'Cotação', value: 540000, priority: 'Média', offset: 10 },
    { title: 'Renovação frota executiva', contact: 5, product: 'Seguro auto', stage: 'Diagnóstico', value: 720000, priority: 'Alta', offset: 6 },
    { title: 'Plano executivo internacional', contact: 6, product: 'Plano de saúde', stage: 'Novo lead', value: 1980000, priority: 'Média', offset: 15 },
    { title: 'Seguro de crédito · exportação', contact: 7, product: 'Seguro de crédito', stage: 'Proposta', value: 3260000, priority: 'Alta', offset: 8 },
    { title: 'Benefícios · nova unidade', contact: 2, product: 'Benefícios corporativos', stage: 'Perdido', value: 220000, priority: 'Baixa', offset: -6 },
  ];
  const policies = [
    { number: 'DEMO-SA-2026-001', contact: 0, product: 'Plano de saúde', insurer: 'SulAmérica', premium: 3840000, commissionRate: 8, offset: 18 },
    { number: 'DEMO-AU-2026-002', contact: 5, product: 'Seguro auto', insurer: 'Porto', premium: 720000, commissionRate: 15, offset: 7 },
    { number: 'DEMO-CO-2026-003', contact: 3, product: 'Consórcio', insurer: 'Rodobens', premium: 1280000, commissionRate: 4, offset: 140 },
  ];
  const tasks = [
    { title: 'Apresentar proposta de seguro de crédito', contact: 1, type: 'Reunião', offset: 0 },
    { title: 'Retornar cotação de benefícios', contact: 2, type: 'Ligação', offset: 0 },
    { title: 'Iniciar renovação da frota', contact: 5, type: 'Retorno', offset: 1 },
    { title: 'Enviar comparativo dos planos', contact: 6, type: 'E-mail', offset: 2 },
    { title: 'Confirmar documentação pendente', contact: 7, type: 'Ligação', offset: -1 },
  ];
  return [
    ...contacts.map((contact, i) => ({ entity: 'contacts' as const, id: ids[i], data: { ...contact, email: `contato${i + 1}@exemplo.invalid`, phone: '', consent: false, notes: 'Dado fictício para demonstração. Não representa cliente real.' } })),
    ...deals.map((deal, i) => { const { contact, offset, ...data } = deal; return { entity: 'deals' as const, id: `${prefix}-deal-${i}`, data: { ...data, contactId: ids[contact], expectedClose: relative(offset), notes: 'Oportunidade fictícia.' } }; }),
    ...policies.map((policy, i) => { const { contact, offset, ...data } = policy; return { entity: 'policies' as const, id: `${prefix}-policy-${i}`, data: { ...data, contactId: ids[contact], startDate: relative(offset - 365), endDate: relative(offset), status: 'Ativa', notes: 'Contrato fictício de demonstração.' } }; }),
    ...tasks.map((task, i) => { const { contact, offset, ...data } = task; return { entity: 'tasks' as const, id: `${prefix}-task-${i}`, data: { ...data, contactId: ids[contact], dueDate: relative(offset), done: false, notes: 'Atividade fictícia.' } }; }),
  ];
}

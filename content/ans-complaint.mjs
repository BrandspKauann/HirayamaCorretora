const title = 'Reclamação na ANS: telefone e canais oficiais de atendimento';
export const ansComplaintPost = {
  route: '/post/como-abrir-uma-reclamação-na-ans/', title, seoTitle: title,
  description: 'Precisa reclamar do plano de saúde? Confira o telefone da ANS, o atendimento eletrônico e o que separar antes de registrar sua solicitação.',
  updatedAt: '2026-10-25', category: 'Plano de Saúde', minutes: '3 min de leitura',
  articleContent: {
    summary: 'Se a operadora não solucionou o problema, consulte os canais oficiais da ANS. Guarde o protocolo do atendimento e organize a documentação antes de registrar a reclamação.',
    decisionCards: [
      ['Telefone oficial', 'Disque ANS: 0800 701 9656.'],
      ['Atendimento eletrônico', 'Acesse o portal oficial da ANS para registrar sua solicitação.'],
      ['Protocolo', 'Guarde o registro do contato anterior com a operadora.'],
    ],
    sections: [
      { id: 'canais', title: 'Qual é o telefone da ANS para reclamação?', paragraphs: ['O Disque ANS atende pelo 0800 701 9656, de segunda a sexta-feira, das 8h às 20h, exceto feriados nacionais. Há também atendimento eletrônico no portal oficial. Confirme horários e canais no link da ANS abaixo.'] },
      { id: 'whatsapp', title: 'ANS tem WhatsApp para reclamação?', paragraphs: ['Não confunda a ANS com a operadora do plano ou com a corretora. Antes de enviar documentos por um número de WhatsApp encontrado na internet, confirme se ele está listado pela própria ANS. Use os canais oficiais indicados nas fontes desta página.'] },
      { id: 'preparar', title: 'O que separar antes de registrar?', paragraphs: ['Tenha o protocolo do contato com a operadora e organize os dados do plano e a descrição do ocorrido. Envie documentos somente pelo canal oficial solicitado.'] },
      { id: 'acompanhar', title: 'Como acompanhar a reclamação?', paragraphs: ['Consulte a Área do Solicitante no portal oficial e acompanhe as orientações recebidas. A página de acompanhamento da ANS explica como consultar solicitações e processos.'] },
    ],
    questions: ['Você já registrou o problema com a operadora?', 'Guardou o protocolo?', 'Conferiu o endereço do canal oficial?'],
    faq: [
      ['A Hirayama é a central da ANS?', 'Não. A Hirayama é uma corretora. O registro e o acompanhamento da reclamação devem ser feitos nos canais oficiais da agência.'],
      ['Posso abrir a reclamação pelo site?', 'A ANS oferece atendimento eletrônico. Acesse o portal da agência pelos links oficiais abaixo.'],
    ],
    note: 'Conteúdo informativo. Canais consultados em 25/10/2026; confirme orientações vigentes no portal da ANS. Não envie documentos pessoais à corretora para registrar uma reclamação na agência.',
    sources: [
      ['ANS: canais de atendimento ao consumidor', 'https://www.gov.br/ans/pt-br/canais_atendimento/canais-de-atendimento-ao-consumidor-1'],
      ['ANS: acompanhamento de reclamações e processos', 'https://www.gov.br/ans/pt-br/assuntos/consumidor/acompanhamento-de-solicitacoes-2'],
    ],
    closing: 'Resolver uma reclamação e comparar um novo contrato são necessidades diferentes. Para a reclamação, use a ANS; se quiser avaliar opções de contratação, converse com a Hirayama.',
  },
};

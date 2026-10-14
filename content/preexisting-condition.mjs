const title = 'Doença preexistente no plano de saúde: como funciona a declaração?';

export const preexistingConditionPost = {
  route: '/post/como-os-planos-de-saúde-identificam-a-omissão-de-doenças-preexistentes/',
  title,
  seoTitle: title,
  description: 'Entenda como declarar doenças preexistentes, quais informações são avaliadas e os cuidados antes de contratar um plano de saúde.',
  updatedAt: '2026-10-14',
  category: 'Plano de Saúde',
  minutes: '4 min de leitura',
  tags: ['#PlanoDeSaude', '#DeclaracaoDeSaude', '#ANS'],
  articleContent: {
    summary: 'A declaração de saúde ajuda a esclarecer as condições da contratação. Antes de assinar, entenda o que informar, peça orientação para as dúvidas e confira as regras de cobertura da proposta.',
    decisionCards: [
      ['O que informar', 'Doenças e lesões que você sabe que possui ao entrar no plano.'],
      ['Como esclarecer dúvidas', 'Solicite uma entrevista qualificada para preencher a declaração com orientação médica.'],
      ['O que comparar', 'Rede, carências, regras de cobertura e suporte durante a contratação.']
    ],
    sections: [
      {
        id: 'declaracao',
        title: 'O que é a declaração de saúde?',
        paragraphs: [
          'É o formulário em que o beneficiário informa doenças ou lesões conhecidas no momento da contratação. A preexistência se refere ao conhecimento da condição nessa data, conforme as regras da ANS.',
          'Leia as perguntas com atenção. Se houver dúvida, peça a entrevista qualificada: um médico ajuda a esclarecer o preenchimento. Quando o profissional é indicado pela operadora, essa orientação não tem custo para o beneficiário.'
        ]
      },
      {
        id: 'cobertura',
        title: 'Como a declaração pode afetar a cobertura?',
        paragraphs: [
          'Quando aplicável, a Cobertura Parcial Temporária (CPT) pode restringir por até 24 meses cirurgias, leitos de alta tecnologia e procedimentos de alta complexidade ligados exclusivamente à condição declarada. Não é uma exclusão de todos os atendimentos do plano.',
          'CPT e carência são conceitos diferentes. Solicite as condições por escrito e verifique se há alguma hipótese de isenção para sua forma de contratação. A análise precisa considerar o contrato e as regras aplicáveis ao seu caso.'
        ]
      },
      {
        id: 'avaliacao',
        title: 'Como a operadora avalia as informações?',
        paragraphs: [
          'A declaração e a entrevista qualificada fazem parte da avaliação na adesão. Uma suspeita posterior de omissão não comprova, por si só, que o beneficiário conhecia a doença antes de contratar.',
          'A RN 558 da ANS prevê um procedimento para analisar alegações de omissão. Cabe à operadora demonstrar o conhecimento prévio; não se admite negativa de atendimento, suspensão ou rescisão unilateral até a conclusão do processo na ANS.'
        ]
      },
      {
        id: 'antes-de-assinar',
        title: 'O que conferir antes de assinar?',
        paragraphs: ['Organize a decisão com documentos e respostas claras. Peça apoio para comparar propostas, em vez de escolher apenas pela mensalidade.'],
        intro: 'Use esta lista antes de preencher ou assinar a proposta.',
        list: [
          'Leia a declaração e esclareça cada pergunta com a operadora.',
          'Confira hospitais, médicos e região de atendimento.',
          'Compare as regras de carência e CPT das propostas.',
          'Guarde cópia da declaração, do contrato e dos esclarecimentos recebidos.'
        ]
      }
    ],
    questions: [
      'Quais dúvidas precisam ser esclarecidas antes de preencher a declaração?',
      'Quais hospitais e médicos são importantes para você?',
      'As condições da proposta estão registradas por escrito?'
    ],
    faq: [
      ['Ter uma doença preexistente significa ficar sem todos os atendimentos?', 'Não. A CPT, quando aplicável, tem alcance específico para determinados procedimentos relacionados à condição declarada. Confira também carências e cobertura contratual.'],
      ['Posso pedir ajuda para preencher a declaração?', 'Sim. A entrevista qualificada permite receber orientação médica. O profissional indicado pela operadora não tem custo para o beneficiário.'],
      ['A corretora substitui o médico na declaração?', 'Não. A Hirayama orienta a comparação das propostas e os próximos passos da contratação; dúvidas clínicas devem ser esclarecidas na orientação médica.']
    ],
    note: 'Conteúdo educativo, com fontes oficiais consultadas em 14/10/2026. Situações individuais devem ser verificadas com a operadora e, quando necessário, com a ANS.',
    sources: [
      ['ANS: doenças preexistentes e Cobertura Parcial Temporária', 'https://www.gov.br/ans/pt-br/assuntos/consumidor/cobertura-parcial-temporaria-cpt-para-doencas-e-lesoes-preexistentes'],
      ['Resolução Normativa ANS nº 558/2022', 'https://bvsms.saude.gov.br/bvs/saudelegis/ans/2022/res0558_30_12_2022.html'],
      ['ANS: cuidados antes de contratar um plano', 'https://www.gov.br/ans/pt-br/assuntos/contratacao-e-troca-de-plano/dicas-de-como-escolher-um-plano-de-saude-1/saiba-antes-de-contratar-um-plano']
    ],
    closing: 'Quer comparar planos com mais clareza? Converse com a Hirayama sobre rede, forma de contratação e condições da proposta. A equipe ajuda a organizar os critérios para sua decisão.'
  }
};

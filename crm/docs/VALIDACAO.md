# Validação da entrega

Execução local em 7 de novembro de 2026, Node 24 no Windows.

- `npx tsc --noEmit`: passou.
- `npm test`: 7 testes passaram usando SQLite real e as migrações geradas. Cobertura de validação, origem, limites do corpo, isolamento por usuário, chaves estrangeiras compostas, concorrência otimista, vínculos, rollback da auditoria e demonstração atômica.
- `npm run test:http`: passou contra o preview em loopback, com D1 local. Verificou autenticação, CRUD das quatro entidades, persistência, centavos, conflito de versão, rejeição de origem externa e auditoria. Removeu os próprios registros de teste.
- Navegador: carregamento explícito da demonstração; cadastro e edição de contato; persistência após recarregar; busca; mudança da etapa de oportunidade; conclusão de atividade; exportação CSV com download confirmado; carteira de apólices.
- Layout verificado em 1440 px e 390 px. Menu móvel e navegação confirmados; não houve rolagem horizontal do documento na largura móvel. As tabelas e o quadro comercial possuem rolagem própria.
- Console do navegador: nenhuma mensagem de erro na revisão.

Os registros da revisão visual são fictícios e existem apenas no D1 local. O banco publicado inicia vazio; a demonstração só é criada por ação explícita do usuário.

O login de produção depende da autenticação gerenciada pela hospedagem. Os fluxos foram exercitados com a identidade simulada do preview local; isso não equivale a um teste de integração de terceiros. WhatsApp, Formspree, calendário e e-mail permanecem sem conexão ativa nesta versão.

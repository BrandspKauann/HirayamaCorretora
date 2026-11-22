# Hirayama CRM

CRM da Hirayama Corretora, construído a partir da pesquisa dos repositórios [HirayamaCorretora](https://github.com/BrandspKauann/HirayamaCorretora), [hirayama-intelligence](https://github.com/BrandspKauann/hirayama-intelligence) e [hirayama-77691](https://github.com/BrandspKauann/hirayama-77691). O primeiro é o site institucional; os demais são analytics e landing page de crédito.

## Funcionalidades

- Painel com indicadores calculados sobre os registros do usuário.
- Clientes e leads, empresas, contatos, origem e consentimento declarado.
- Funil de oportunidades com diagnóstico, cotação, proposta e negociação.
- Apólices, vigências, prêmio, comissão estimada e acompanhamento de renovações.
- Atividades com prazo e conclusão; relatórios e exportação CSV.
- Histórico de alterações e controle de concorrência por versão.
- Banco persistente, autenticação ChatGPT e isolamento por usuário.
- Demonstração opcional com registros fictícios, carregada apenas por ação explícita em um CRM vazio.

Esta entrega opera como espaço individual privado. Integrações de captação, WhatsApp, envio de e-mail, equipes e permissões por papel estão descritas como evolução, sem conexão ativa nesta versão.

## Arquitetura

Monólito modular em React, TypeScript e Vinext, executado em Cloudflare Workers, com D1/SQLite e migrações Drizzle. O backend autoriza cada operação e filtra os dados pelo identificador autenticado. Dinheiro é armazenado em centavos; datas de negócio seguem America/Sao_Paulo.

Leia [a arquitetura detalhada](docs/ARQUITETURA.md) e [o guia de operação](docs/OPERACAO.md).

## Desenvolvimento

Requer Node >=22.13, npm e Git. A aplicação é independente do site institucional.

```sh
npm ci
npm run db:generate
npm run build
```

Após gerar o build, aplique a migração local uma única vez (use o nome do arquivo SQL efetivamente gerado em drizzle/):

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_busy_black_bird.sql
npm run dev -- --port 5186
```

O build gera a configuração local do D1 em dist/server/wrangler.json. No preview portátil, /signin-with-chatgpt?return_to=/ simula a identidade local; esta simulação fica fora do build de produção. Em produção, a autenticação é fornecida pela hospedagem Sites.

## Validação e publicação

```sh
npx tsc --noEmit
npm test
npm run build
```

Com o preview local em execução, `npm run test:http` valida os fluxos HTTP usando apenas registros fictícios temporários. Consulte [a evidência de validação](docs/VALIDACAO.md).

As migrações são aplicadas pelo fluxo Sites durante publicação. .openai/hosting.json declara a identidade do projeto e o binding DB. A publicação conserva o acesso privado. Não existem chaves de API necessárias para as funções centrais; integrações futuras devem usar segredos no servidor.

Não publique .env, .wrangler, dados locais, tokens ou arquivos de execução. Exportação CSV é ferramenta operacional e não substitui backup completo e restore testado do banco.

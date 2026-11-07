# Hirayama Corretora

Site estático da Hirayama Corretora, com layout autoral, páginas institucionais, blog, página de links e assets locais.

## Comandos

```bash
npm run build
npm run serve
```

O build gera os arquivos em `site/`, com imagens e PDFs baixados localmente.

## CRM Hirayama

O aplicativo independente em [`crm/`](crm/README.md) reúne clientes e leads, funil comercial, apólices, renovações, atividades, relatórios e auditoria. Usa React/TypeScript, Cloudflare Workers e D1, com acesso privado e isolamento por usuário. Seu build e deploy são separados do site institucional.

Consulte a [arquitetura completa](crm/docs/ARQUITETURA.md), o [guia de operação](crm/docs/OPERACAO.md) e as [verificações da entrega](crm/docs/VALIDACAO.md).

# Operação do CRM Hirayama

Manual da primeira entrega, em 7 de novembro de 2026. Ver também [ARQUITETURA.md](ARQUITETURA.md) para contratos, fronteiras de segurança e evolução.

## 1. Ambientes e pré-requisitos

- Node.js compatível com `package.json` (mínimo declarado 22.13.0).
- Dependências instaladas a partir do lockfile.
- D1 local para desenvolvimento; D1 hospedado provisionado pelo Sites para publicação.
- Acesso ao Site privado com Sign in with ChatGPT em produção.

O diretório `.wrangler/state` contém dados de desenvolvimento e é ignorado pelo Git. Ele não é uma cópia do banco publicado. `.sites-runtime` guarda configuração local de ferramentas; não deve ser distribuído como credencial ou configuração de produção.

O mock de login do perfil portátil serve apenas ao desenvolvimento em loopback. Não publicar uma alternativa que confie em um usuário fixo ou aceite identidade fornecida pelo navegador.

## 2. Desenvolvimento local

Na raiz do CRM:

```powershell
npm run install:ci
npm run build
```

Para uma instalação mantida pelo plugin Sites, usar os helpers de instalação/build definidos no fluxo do plugin. Não executar dois instaladores em paralelo nem modificar o lockfile durante instalação.

O build gera `dist/server/wrangler.json`. Aplicar cada migração pendente em ordem, substituindo abaixo o nome pelo arquivo real presente em `drizzle/`:

```powershell
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_nome_real.sql
```

Não executar literalmente o nome ilustrativo `0000_nome_real.sql` e não reaplicar migrações já executadas. Usar `.wrangler/state`, pois o Wrangler cria a própria estrutura de versão. Para desenvolvimento:

```powershell
npm run dev -- --host 127.0.0.1 --port 4173
```

Usar o endereço efetivamente exibido pelo servidor. No perfil portátil, o fluxo local `/signin-with-chatgpt?return_to=/` cria a identidade de demonstração do starter. Esse comportamento de desenvolvimento não integra o build de produção.

`npm start` permite conferir o Worker já compilado. Ele não publica o Site e não fornece por si só o mock de autenticação do servidor de desenvolvimento.

## 3. Alterações no esquema

1. Alterar `db/schema.ts`.
2. Gerar a próxima migração com `npm run db:generate`.
3. Inspecionar SQL, snapshot e journal em `drizzle/`; manter migrações pequenas e apenas de esquema.
4. Aplicar a migração no D1 local, preservar dados existentes e testar leitura/gravação.
5. Versionar fonte e migração juntos.
6. Publicar pelo fluxo Sites; o serviço aplica migrações no banco hospedado.

Não criar tabelas durante requisições HTTP. Seeds e importações de dados ficam fora das migrações de esquema. Não editar migração ou snapshot que já tenha sido aplicado em algum ambiente; acrescentar nova migração corretiva.

## 4. Validação antes de publicar

Executar o build e a verificação TypeScript apropriada ao projeto. Executar a suíte de domínio/API disponível na versão do repositório; registrar resultado e limitações no relatório de entrega. Não declarar sucesso de testes apenas porque os arquivos existem.

Verificações funcionais relevantes:

| Área | Evidência esperada |
| --- | --- |
| Persistência | Criar, editar, recarregar e encontrar o mesmo contato no servidor |
| Relacionamentos | Vincular oportunidade, contrato e tarefa ao contato existente |
| Validação | Valores negativos, enums inválidos e referência inexistente não são gravados |
| Isolamento | Identidade A não lê nem altera registro de B; vínculo cruzado é rejeitado |
| Concorrência | Segunda atualização com versão antiga recebe conflito |
| Autenticação | API rejeita usuário ausente; login local não aparece no build publicado |
| Origem | Mutações com origem não autorizada são rejeitadas |
| Exclusão | Contato com registros dependentes não produz registros órfãos |
| Auditoria | Alteração bem-sucedida aparece no histórico do proprietário |
| Interface | Navegação, busca/filtros, formulários, estados vazios e largura de celular funcionam |

Testes locais não comprovam automaticamente autenticação e acesso na borda de produção. O resultado de publicação do Sites comprova o deploy; verificações autenticadas de uso, quando executadas, devem ser registradas separadamente.

## 5. Publicação pelo Sites

O arquivo `.openai/hosting.json` preserva o `project_id`, `d1: "DB"` e `r2: null`. É uma aplicação com servidor: não adicionar configuração de Site estático ao manifesto.

Fluxo operacional:

1. Reutilizar a identidade do Site já registrada. Não criar outro projeto para uma atualização.
2. Confirmar o acesso atual do Site; a entrega inicial é privada e restrita ao proprietário.
3. Abrir/sincronizar o repositório de fonte pelo helper Sites e sua credencial temporária. Credenciais entram por stdin e não ficam em argumentos, arquivos versionados ou saída de logs.
4. Executar checks/builds pendentes e empacotar a versão com o helper de fonte.
5. Salvar e publicar usando o projeto, commit e arquivo retornados pelo helper, preservando o acesso privado.
6. Acompanhar somente deployments pendentes até o resultado terminal. Não iniciar um novo deployment para consultar o progresso de outro.
7. Guardar no registro da mudança: SHA, versão salva, identificação do deployment, URL, migrações incluídas e resultado de validação.

Não usar `wrangler deploy` diretamente no lugar do fluxo integrado do Sites. Segredos de integrações futuras pertencem às variáveis de runtime do Site; nenhuma chave é necessária para o cadastro manual básico.

## 6. Rotina de uso e integridade

Cadastro recomendado: contato → diagnóstico/oportunidade → registros de acompanhamento → contrato/apólice → tarefa de renovação. Alterar etapa não emite documento nem realiza contato com terceiros. O usuário registra manualmente resultados de conversas e propostas nesta versão.

Todos os valores monetários da API usam centavos inteiros. Verificar a unidade antes de qualquer importação futura. `commissionRate` é percentual, e não fração. Datas de vigência e vencimento são datas civis; não converter indiscriminadamente uma data `YYYY-MM-DD` em timestamp UTC que altere o dia exibido no Brasil.

Em conflito de versão, recarregar o registro, comparar as alterações e reaplicar a intenção sobre a versão atual. Não incrementar `version` no navegador para forçar uma gravação. A versão é controlada pelo servidor.

Antes de excluir um contato, resolver seus vínculos. Quando o objetivo é apenas suspender o relacionamento, usar status `Inativo` mantém contexto comercial. Exclusões devem observar as necessidades reais de retenção e a política definida pelo controlador dos dados.

## 7. Exportação, backup e restauração

A exportação CSV oferecida pela interface é útil para análise e portabilidade dos registros exibidos. Ela é **parcial**, pode depender da visão/filtro e não representa uma cópia completa recuperável de todas as tabelas, IDs, versões, relacionamentos e auditoria. Não existe promessa de restauração a partir desse CSV.

Antes de uso intensivo com dados reais, estabelecer com o administrador da hospedagem uma rotina de exportação completa do D1 por ferramenta autorizada. Não presumir que acesso de escrita ao repositório dá acesso administrativo ao banco de produção.

Uma cópia recuperável deve incluir:

- Dump completo consistente do banco, incluindo tabelas comerciais e auditoria.
- Esquema e migrações correspondentes ao momento da cópia.
- Identificação do Site e dos bindings, sem segredos embutidos.
- Metadados da cópia: horário, origem, versão da aplicação, checksum e responsável.
- Cópia fora do ambiente primário, cifrada e com acesso e retenção definidos.

Proposta inicial, ainda dependente de implantação e teste: exportação diária, retenção de 30 dias, RPO de 24 horas e RTO de um dia útil. Esses números são metas operacionais propostas, **não garantias da aplicação ou da plataforma**. Ajustar conforme volume, criticidade, contrato de hospedagem e evidência de restauração.

Ensaio de recuperação:

1. Identificar o ponto de recuperação e interromper novas escritas, quando necessário.
2. Restaurar primeiro em ambiente isolado autorizado.
3. Conferir contagens, somas monetárias, vínculos de contato, versões e amostras de histórico.
4. Confirmar que `owner_id` continua compatível com a identidade do mesmo Site. IDs de usuário do Sites diferem entre Sites; migrar para outro projeto requer uma estratégia explícita de remapeamento autorizada.
5. Testar autenticação e acesso antes de liberar o ambiente recuperado.
6. Documentar duração, perda efetiva de dados e ações de prevenção.

Nunca testar restauração destrutiva diretamente no banco em uso.

## 8. Observabilidade e incidentes

Nesta entrega, as fontes básicas são o status de deployment do Sites, logs do Worker disponíveis ao administrador, erros da API e o histórico de operações do CRM. Não há central externa de alertas, tracing distribuído ou monitoramento de SLA configurados.

Métricas recomendadas para a evolução: taxa de erros 5xx e 4xx por classe, duração de requisições, conflitos 409, falhas de migração, tempo desde o último backup recuperável e volume por tabela. Logs técnicos devem usar código de erro, método, rota e identificador de correlação quando disponível; omitir dados de contato, notas, tokens e corpos completos.

| Sintoma | Investigação e ação |
| --- | --- |
| Site não abre após publicar | Consultar o deployment existente e logs do Worker; verificar build e binding D1 |
| Login volta repetidamente | Confirmar URL e acesso do Site; usar navegação de topo no fluxo SIWC; não substituir por usuário fixo |
| API sem identidade | Conferir passagem pelo gateway Sites e cabeçalhos no servidor, sem registrá-los em logs públicos |
| Erro de esquema/tabela | Comparar migrações esperadas/aplicadas; uma falha de deploy pode ter aplicado parte do novo esquema |
| Dados parecem ausentes | Conferir usuário e ambiente; dados de outro proprietário ou banco local não devem aparecer |
| Conflito de edição | Recarregar e revisar a versão; não realizar retry cego |
| Contato não pode ser excluído | Conferir oportunidades, contratos e tarefas associados |
| Falha de persistência | Preservar o formulário, reportar erro e tentar novamente após a causa; não apresentar sucesso antes da resposta |

Reverter a versão do Worker pode corrigir regressão de código, mas não desfaz migrações e alterações de dados. Preferir correção compatível com o esquema atual; planejar restauração somente com cópia validada e avaliação de perda.

## 9. Limites e preparação da próxima fase

Esta versão atende ao proprietário do Site, com dados separados por identidade. Não existe equipe compartilhando carteira, integração WhatsApp, caixa de entrada de e-mail, recepção automática de leads do Formspree, cobrança ou emissão integrada. Não cadastrar chaves dessas ferramentas esperando ativação automática.

Antes de liberar uso em equipe, implementar membership e RBAC, testar autorização em cada operação e definir quem pode exportar/excluir dados. Antes de integrar canais, implementar autenticação própria do canal, idempotência, fila/tentativas e logs sem dados pessoais. Antes de crescer a base, medir o snapshot e introduzir paginação e consultas no servidor.

Uma futura migração para PostgreSQL deve ser motivada por requisitos medidos, com plano de corte e reconciliação. Trocar banco não resolve autorização, backup ou qualidade dos dados por si só.

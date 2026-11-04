import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
test('4 November article is complete, crawlable and illustrated',async()=>{
 const root=new URL('../',import.meta.url);
 const html=await fs.readFile(new URL('site/post/plano-descredenciou-hospital-o-que-conferir/index.html',root),'utf8');
 assert.equal((html.match(/<h1(?:\s[^>]*)?>/g)||[]).length,1);
 assert.ok(html.includes("Seu plano descredenciou um hospital? O que conferir antes de trocar"));
 for(const heading of ["A rede pertence ao produto, não apenas à marca","Leia o comunicado pela mudança que ele descreve","Compare a alternativa com a sua rotina de atendimento","Portabilidade exige uma verificação própria","O melhor próximo passo pode ser esclarecer antes de mudar"])assert.ok(html.includes(heading));
 assert.ok(html.includes('Imagem ilustrativa gerada por IA')||html.includes('imagem de capa ilustrativa gerada por IA'));
 assert.ok(html.includes('"@type":"Organization"'));
 const map=await fs.readFile(new URL('site/sitemap.xml',root),'utf8');
 assert.ok(map.includes('plano-descredenciou-hospital-o-que-conferir'));
 assert.ok(html.includes('Fontes conferidas em 4 de novembro de 2026.'));
});

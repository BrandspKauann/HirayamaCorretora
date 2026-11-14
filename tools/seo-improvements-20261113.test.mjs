import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
test('existing auto article has specific original guidance and crawlable contact links',async()=>{
 const slug='cobertura-terceiros-seguro-auto-quanto-contratar';
 const html=await fs.readFile(new URL('../site/post/'+slug+'/index.html',import.meta.url),'utf8');
 assert.equal((html.match(/<h1>/g)||[]).length,1);
 assert.match(html,/SUSEP: seguro de responsabilidade civil e RCF-V/);
 assert.match(html,/href="\/cote-agora\/"/);
 assert.match(html,/Compare os limites de cada cobertura/);
 assert.doesNotMatch(html,/Este artigo organiza os pontos|avaliação clínica/);
 assert.match(html,/"dateModified":"2026-11-13T15:00:00.000Z"/);
 const map=await fs.readFile(new URL('../site/sitemap.xml',import.meta.url),'utf8');
 assert.ok(map.includes(slug+'/</loc><lastmod>2026-11-13T15:00:00.000Z</lastmod>'));
});

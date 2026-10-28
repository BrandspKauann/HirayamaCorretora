import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
test('weekly article retains its original narrative, image and organizational byline',async()=>{
 const slug='mamografia-digital-plano-saude-cobertura-outubro-2026';
 const posts=JSON.parse(await fs.readFile(new URL('../content/published-scheduled-posts.json',import.meta.url)));
 const post=posts.find(p=>p.slug===slug);
 assert.ok(post.editorial&&post.authorOrganization);
 const html=await fs.readFile(new URL('../site/post/'+slug+'/index.html',import.meta.url),'utf8');
 assert.equal((html.match(/<h1>/g)||[]).length,1);
 for(const s of post.sections)assert.ok(html.includes(s.heading));
 assert.match(html,/"@type":"Organization","name":"Hirayama Corretora"/);
 assert.match(html,/property="og:image"/);
 assert.ok(html.includes(post.imageAlt));
 assert.ok((await fs.stat(new URL('../site/assets/blog/scheduled/'+post.image,import.meta.url))).size<150000);
 const map=await fs.readFile(new URL('../site/sitemap.xml',import.meta.url),'utf8');
 assert.ok(map.includes('https://www.hirayamacorretora.com.br/post/'+slug+'/'));
 assert.doesNotMatch(map,/<loc>\//);
});

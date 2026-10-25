import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { ansComplaintPost } from '../content/ans-complaint.mjs';

test('ANS article answers real search intent and preserves the preexisting-condition experiment', async () => {
  const html = await fs.readFile(new URL('../site/post/como-abrir-uma-reclamação-na-ans/index.html', import.meta.url), 'utf8');
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.ok(html.includes(ansComplaintPost.seoTitle));
  assert.match(html, /0800 701 9656/);
  assert.match(html, /ANS tem WhatsApp/);
  assert.match(html, /A Hirayama é uma corretora/);
  assert.match(html, /gov\.br\/ans\/pt-br\/canais_atendimento/);
  const frozen = await fs.readFile(new URL('../site/post/como-os-planos-de-saúde-identificam-a-omissão-de-doenças-preexistentes/index.html', import.meta.url), 'utf8');
  assert.match(frozen, /<title>Doença preexistente no plano de saúde: como funciona a declaração\?<\/title>/);
  assert.match(frozen, /<h1>Doença preexistente no plano de saúde: como funciona a declaração\?<\/h1>/);
});

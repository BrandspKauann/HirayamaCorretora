import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(projectDir, 'content');
const assetSourceDir = path.join(projectDir, 'assets', 'blog', 'article-ai-covers');
const assetTargetDir = path.join(contentDir, 'scheduled-assets', 'blog');
const publishedAssetDir = path.join(contentDir, 'published-assets', 'blog');
const firstPublishAt = new Date('2026-08-20T15:00:00.000Z');
const week = 7 * 24 * 60 * 60 * 1000;

const drafts = [
  ['Como escolher seguro auto sem descobrir lacunas só no sinistro', 'como-escolher-seguro-auto-sem-lacunas-no-sinistro', 'Seguro automóvel', 'seguro auto, franquia, cobertura para terceiros, assistência 24 horas'],
  ['Franquia do seguro auto: como comparar sem cair na armadilha da parcela menor', 'franquia-seguro-auto-como-comparar', 'Seguro automóvel', 'franquia seguro auto, cotação seguro auto, cobertura automóvel'],
  ['Cobertura para terceiros no seguro auto: quanto faz sentido contratar?', 'cobertura-terceiros-seguro-auto-quanto-contratar', 'Seguro automóvel', 'cobertura terceiros, danos materiais, seguro auto'],
  ['Seguro auto para quem usa o carro no trabalho: o que muda na análise?', 'seguro-auto-uso-profissional-o-que-muda', 'Seguro automóvel', 'seguro auto uso profissional, carro trabalho, proteção veicular'],
  ['Renovação de seguro auto: quatro pontos para revisar antes de aceitar a proposta', 'renovacao-seguro-auto-pontos-para-revisar', 'Seguro automóvel', 'renovação seguro auto, revisão apólice, cotação'],
  ['Carro reserva, guincho e assistência: o que realmente importa no seguro auto?', 'carro-reserva-guincho-assistencia-seguro-auto', 'Seguro automóvel', 'carro reserva, guincho, assistência 24 horas'],
  ['Sinistro de automóvel: o que fazer nas primeiras horas para evitar mais dor de cabeça', 'sinistro-automovel-o-que-fazer-primeiras-horas', 'Seguro automóvel', 'sinistro automóvel, aviso de sinistro, seguro auto'],
  ['Seguro auto para famílias: como montar uma proteção coerente para a rotina', 'seguro-auto-para-familias-protecao-rotina', 'Seguro automóvel', 'seguro auto família, condutores, proteção patrimonial'],
  ['Plano de saúde empresarial: por que preço não basta para decidir?', 'plano-saude-empresarial-preco-nao-basta', 'Planos de saúde', 'plano de saúde empresarial, benefícios corporativos, RH'],
  ['Sinistralidade no plano de saúde: o que RH e financeiro precisam acompanhar', 'sinistralidade-plano-saude-rh-financeiro', 'Planos de saúde', 'sinistralidade, plano de saúde empresarial, reajuste'],
  ['Reajuste de plano de saúde empresarial: como se preparar antes da renovação', 'reajuste-plano-saude-empresarial-como-preparar', 'Planos de saúde', 'reajuste plano de saúde, renovação empresarial, RH'],
  ['Rede credenciada ou reembolso: como escolher no plano de saúde?', 'rede-credenciada-ou-reembolso-como-escolher', 'Planos de saúde', 'rede credenciada, reembolso, plano de saúde'],
  ['Portabilidade de plano de saúde: quando vale analisar antes de trocar?', 'portabilidade-plano-saude-quando-analisar', 'Planos de saúde', 'portabilidade plano de saúde, troca de plano, ANS'],
  ['Benefícios corporativos: como reduzir ruído entre RH, financeiro e colaboradores', 'beneficios-corporativos-reduzir-ruido-rh-financeiro', 'Benefícios e RH', 'benefícios corporativos, RH, financeiro, colaboradores'],
  ['VA e VR: o que avaliar além da bandeira do cartão?', 'va-vr-o-que-avaliar-alem-bandeira-cartao', 'Benefícios e RH', 'VA VR, vale alimentação, vale refeição, benefícios'],
  ['Benefícios flexíveis: quando eles fazem sentido para a empresa?', 'beneficios-flexiveis-quando-fazem-sentido', 'Benefícios e RH', 'benefícios flexíveis, RH, retenção de talentos'],
  ['Como comunicar benefícios sem transformar o RH em central de dúvidas', 'como-comunicar-beneficios-sem-sobrecarregar-rh', 'Benefícios e RH', 'comunicação de benefícios, RH, experiência do colaborador'],
  ['Seguro de crédito: quando uma venda a prazo começa a pressionar o caixa?', 'seguro-credito-venda-a-prazo-pressiona-caixa', 'Risco empresarial', 'seguro de crédito, vendas a prazo, fluxo de caixa'],
  ['Concentração de clientes: como identificar um risco antes da inadimplência', 'concentracao-clientes-risco-antes-inadimplencia', 'Risco empresarial', 'concentração de clientes, inadimplência, risco empresarial'],
  ['Política de crédito: por que comercial e financeiro precisam decidir juntos', 'politica-credito-comercial-financeiro-decidir-juntos', 'Risco empresarial', 'política de crédito, comercial, financeiro, seguro de crédito'],
  ['Cliente grande pede prazo maior: como avaliar o risco sem travar a venda', 'cliente-grande-pede-prazo-maior-avaliar-risco', 'Risco empresarial', 'prazo de pagamento, risco de crédito, vendas B2B'],
  ['Consórcio para automóvel: quando o planejamento vale mais que a urgência?', 'consorcio-automovel-planejamento-ou-urgencia', 'Crédito planejado', 'consórcio automóvel, crédito planejado, financiamento'],
  ['Consórcio imobiliário: perguntas que ajudam a escolher o grupo com critério', 'consorcio-imobiliario-escolher-grupo-com-criterio', 'Crédito planejado', 'consórcio imobiliário, grupo de consórcio, lance'],
  ['Estratégia de lance no consórcio: o que precisa estar claro antes de ofertar', 'estrategia-lance-consorcio-o-que-precisa-estar-claro', 'Crédito planejado', 'estratégia de lance, consórcio, contemplação'],
  ['Consórcio ou financiamento: como comparar prazo, custo e necessidade de liquidez', 'consorcio-ou-financiamento-como-comparar', 'Crédito planejado', 'consórcio ou financiamento, custo total, crédito'],
  ['Seguro de vida: como proteger renda e família sem contratar por impulso', 'seguro-de-vida-proteger-renda-familia-sem-impulso', 'Proteção pessoal', 'seguro de vida, proteção de renda, planejamento familiar'],
  ['Previdência privada: o que revisar antes de portar um plano?', 'previdencia-privada-o-que-revisar-antes-portar', 'Proteção pessoal', 'previdência privada, portabilidade, planejamento financeiro'],
  ['Responsabilidade civil profissional: quando a exposição da carreira pede proteção?', 'responsabilidade-civil-profissional-quando-protecao', 'Proteção pessoal', 'responsabilidade civil profissional, seguro RC, carreira'],
  ['Saúde internacional: como diferenciar seguro viagem, cartão e cobertura médica?', 'saude-internacional-seguro-viagem-cartao-cobertura-medica', 'Saúde internacional', 'saúde internacional, seguro viagem, cartão de crédito'],
  ['Consórcio para investimento: quando a carta de crédito entra no planejamento patrimonial?', 'consorcio-para-investimento-planejamento-patrimonial', 'Crédito planejado', 'consórcio para investimento, planejamento patrimonial, carta de crédito']
];

const images = await readdir(assetSourceDir);
await mkdir(assetTargetDir, { recursive: true });
await rm(publishedAssetDir, { recursive: true, force: true });
const posts = await Promise.all(drafts.map(async ([title, slug, category, keywordLine], index) => {
  const image = `scheduled-${String(index + 1).padStart(2, '0')}.png`;
  await copyFile(path.join(assetSourceDir, images[index]), path.join(assetTargetDir, image));
  const keywords = keywordLine.split(', ');
  return {
    status: 'scheduled',
    publishAt: new Date(firstPublishAt.getTime() + index * week).toISOString(),
    title,
    slug,
    category,
    description: `Entenda ${keywords.slice(0, 3).join(', ')} com uma análise consultiva, critérios claros e atenção ao que acontece depois da contratação.`,
    readTime: 7,
    image,
    keywords,
    hashtags: keywords.map((keyword) => `#${keyword.replace(/[^A-Za-zÀ-ú0-9]/g, '')}`),
    author: 'Ewerton Hirayama',
    imagePrompt: 'Imagem editorial fotorealista gerada por IA para artigo consultivo da Hirayama, sem texto e sem marcas.'
  };
}));

await writeFile(path.join(contentDir, 'scheduled-posts.json'), `${JSON.stringify(posts, null, 2)}\n`);
await writeFile(path.join(contentDir, 'published-scheduled-posts.json'), '[]\n');
console.log(`Created ${posts.length} scheduled posts.`);

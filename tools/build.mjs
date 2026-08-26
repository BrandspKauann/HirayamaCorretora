import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(__dirname, '..');
const workspaceDir = path.resolve(projectDir, '..');
const sourceCandidates = [
  path.join(projectDir, 'source-data.json'),
  path.join(workspaceDir, '.codex-tmp', 'hirayama-source-data.json')
];
const outDir = path.join(projectDir, 'site');
const scheduledContentDir = path.join(projectDir, 'content');
const publishedScheduledPostsPath = path.join(scheduledContentDir, 'published-scheduled-posts.json');
const originalOrigin = 'https://www.hirayamacorretora.com.br';
const assetVersion = Date.now().toString(36);
const defaultMetaDescription = 'Decisões sem achismo em saúde corporativa, consórcio, crédito e RH. Diagnóstico antes de produto para RHs, CFOs e empresas.';
const healthSiteUrl = 'https://www.saudeinternacional.com.br/';
const creditSiteUrl = 'https://www.segurosdecredito.com.br/';
const vrSiteUrl = 'https://www.consultoriavr.com.br/';
const consortiumSiteUrl = '/consorcio/';
const consortiumContactUrl = '/cote-agora/?servico=consorcio';
const ecosystemSeal = 'Diagnóstico antes de produto';
const heroSideGallery = [
  ['/assets/hero/hero-consorcio-platinum-bg.png', 'Casal feliz dentro do carro em uma decisão de Consórcio Platinum', 'Consórcio Platinum', 'Simular consórcio', consortiumSiteUrl, 'center center'],
  ['/assets/hero/hero-saude-internacional-bg.png', 'Médico orientando uma família sobre Saúde Internacional', 'Saúde Internacional', 'Abrir projeto saúde', healthSiteUrl, 'center center'],
  ['/assets/hero/hero-seguro-credito-bg.png', 'Consultoria de Seguro de Crédito para análise de vendas a prazo', 'Seguro de Crédito', 'Abrir Seguro de Crédito', creditSiteUrl, 'center center'],
  ['/assets/hero/hero-consultoria-rh-bg.png', 'Reunião empresarial sobre Consultoria RH e benefícios', 'Consultoria RH', 'Ver benefícios corporativos', vrSiteUrl, 'center center']
];
const ewertonPhoto = '/assets/people/ewerton-hirayama.jpg';
const customFavicon = '/assets/favicon/favicon.png';
const formspreeEndpoint = 'https://formspree.io/f/mqevdnjo';
const whatsappSiteMessage = 'Olá, vim do site Hirayama Corretora e gostaria de falar com a equipe.';
const whatsappAutoMessage = 'Olá, vim do site Hirayama Corretora e quero cotação de seguro auto.';

const contactServiceOptions = [
  ['plano_saude', 'Plano de saúde'],
  ['seguro_credito', 'Seguro de crédito'],
  ['consultoria_vr', 'Consultoria VR / benefícios corporativos'],
  ['consorcio', 'Consórcio Platinum'],
  ['seguro_auto', 'Seguro automóvel'],
  ['seguro_vida', 'Seguro de vida'],
  ['diagnostico', 'Ainda não sei, quero um diagnóstico']
];

function whatsappHref(phone = '5511972896857', message = whatsappSiteMessage) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function normalizeWhatsAppHref(href) {
  try {
    const url = new URL(href);
    if (!/wa\.me$/i.test(url.hostname)) return href;
    const phone = url.pathname.replace(/\D/g, '') || '5511972896857';
    const previousText = `${url.searchParams.get('text') || ''} ${href}`;
    const message = /auto|automóvel|automovel|carro|cotação|cotacao/i.test(previousText)
      ? whatsappAutoMessage
      : whatsappSiteMessage;
    return whatsappHref(phone, message);
  } catch {
    return href;
  }
}

const serviceNav = [
  ['Plano de Saúde', healthSiteUrl],
  ['Seguro de Crédito', creditSiteUrl],
  ['Consultoria VR', vrSiteUrl],
  ['Consórcio Platinum', consortiumSiteUrl],
];

const curatedPartners = [
  {
    name: 'Porto',
    category: 'Seguros e assistência',
    url: 'https://www.portoseguro.com.br',
    logo: '/assets/partners/porto.png'
  },
  {
    name: 'Porto Consórcio',
    category: 'Consórcio de imóveis e veículos',
    url: 'https://www.portoseguro.com.br/consorcio',
    logo: '/assets/partners/porto-consorcio.png'
  },
  {
    name: 'Rodobens',
    category: 'Consórcio e planejamento patrimonial',
    url: 'https://www.rodobens.com.br/consorcio',
    logo: '/assets/partners/rodobens-consorcio.png'
  },
  {
    name: 'VR Benefícios',
    category: 'Vale refeição e alimentação',
    url: 'https://www.vr.com.br',
    logo: '/assets/partners/vr-beneficios.png'
  },
  {
    name: 'Caju',
    category: 'Benefícios flexíveis',
    url: 'https://www.caju.com.br',
    logo: '/assets/partners/caju-color.png'
  },
  {
    name: 'Flash',
    category: 'Benefícios corporativos',
    url: 'https://flashapp.com.br',
    logo: '/assets/partners/flash-color.png'
  },
  {
    name: 'iFood Benefícios',
    category: 'Vale refeição e alimentação',
    url: 'https://beneficios.ifood.com.br',
    logo: '/assets/partners/ifood.svg'
  },
  {
    name: 'Icatu Seguros',
    category: 'Vida e previdência',
    url: 'https://www.icatuseguros.com.br',
    logo: '/assets/partners/icatu.png'
  },
  {
    name: 'Brazil Health Insurance Specialists',
    category: 'Seguro saúde internacional',
    url: 'https://www.brazilhealth.com',
    logo: '/assets/partners/brazilhealth.png'
  },
  {
    name: 'Amil',
    category: 'Saúde suplementar',
    url: 'https://www.amil.com.br',
    logo: '/assets/partners/amil.png'
  },
  {
    name: 'SulAmérica Saúde',
    category: 'Planos de saúde',
    url: 'https://www.sulamerica.com.br',
    logo: '/assets/partners/sulamerica.png'
  },
  {
    name: 'Care Plus',
    category: 'Saúde premium',
    url: 'https://www.careplus.com.br',
    logo: '/assets/partners/careplus.png'
  },
  {
    name: 'Tokio Marine Seguradora',
    category: 'Seguros patrimoniais',
    url: 'https://www.tokiomarine.com.br',
    logo: '/assets/partners/tokio-marine.png'
  }
];

const nav = [
  ['Início', '/'],
  ['Consórcio Platinum', consortiumSiteUrl],
  ['Downloads', '/downloads/'],
  ['Blog', '/blog/'],
  ['Vídeos', '/videos/'],
  ['Fale Conosco', '/cote-agora/']
];

const videos = [
  {
    id: '8FPDlEQ-KAg',
    title: 'O que está por trás do reajuste do seu plano',
    description: 'Ewerton Hirayama explica os pontos que merecem atenção antes de analisar o reajuste de um plano de saúde.',
    category: 'Planos de saúde'
  },
  {
    id: 'eHPhI-QoIpY',
    title: 'Experiência incrível no CONARH!',
    description: 'Um olhar da Hirayama sobre conversas, pessoas e decisões que marcaram o CONARH.',
    category: 'Consultoria RH'
  }
];

const navLabels = new Set([
  'Ir para o conteúdo principal',
  'Início',
  'Serviços',
  'Plano de Saúde',
  'Seguro Automóvel',
  'Consórcio',
  'Seguro de Vida',
  'Fale Conosco',
  'Downloads',
  'Blog',
  'Vídeos',
  'Mais',
  'Cota Auto',
  'POLÍTICA DE PRIVACIDADE',
  'Todos posts',
  'Seguros',
  'Cartões',
  'Maternidade',
  'RH',
  'Noticias'
]);

const ctaWords = /whatsapp|cote|cotação|solicite|simule|visitem|baixar|enviar|cotador|porto|suporte/i;
const assetMap = new Map();
const documentMap = new Map();

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function hash(input) {
  return createHash('sha1').update(input).digest('hex').slice(0, 10);
}

function sanitizeFileName(name) {
  return decodeURIComponent(name || 'asset')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 54) || 'asset';
}

function extFromContentType(type, fallback) {
  const clean = (type || '').split(';')[0].trim().toLowerCase();
  if (clean === 'image/avif') return '.avif';
  if (clean === 'image/webp') return '.webp';
  if (clean === 'image/png') return '.png';
  if (clean === 'image/jpeg') return '.jpg';
  if (clean === 'image/svg+xml') return '.svg';
  if (clean === 'application/pdf') return '.pdf';
  return fallback || '.bin';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function decodeXml(value = '') {
  return value
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&nbsp;', ' ');
}

function splitLines(text) {
  return String(text || '')
    .split(/\n+/)
    .map((line) => line.replace(/\u00a0/g, ' ').trim())
    .filter(Boolean)
    .filter((line) => line !== '​' && line !== ' ');
}

function routeFromUrl(url) {
  const parsed = new URL(url, originalOrigin);
  let pathname = decodeURIComponent(parsed.pathname);
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') + '/';
}

function routeFile(route) {
  if (route === '/') return path.join(outDir, 'index.html');
  return path.join(outDir, route.replace(/^\/+/, ''), 'index.html');
}

function pageByRoute(data, route) {
  return data.results.find((item) => routeFromUrl(item.url) === route);
}

function pageByPath(data, fragment) {
  return data.results.find((item) => decodeURIComponent(new URL(item.url).pathname).includes(fragment));
}

function cleanLines(item) {
  const raw = splitLines(item.bodyText);
  const end = raw.findIndex((line) => line.startsWith('©2020') || line.startsWith('Utilizamos cookies'));
  return (end >= 0 ? raw.slice(0, end) : raw).filter((line) => !navLabels.has(line));
}

function usefulLinks(item) {
  return item.links
    .filter((link) => link.text && !navLabels.has(link.text))
    .filter((link) => !/política de privacidade/i.test(link.text))
    .map((link) => ({ ...link, href: localHref(link.href) }));
}

function localHref(href) {
  if (!href) return '#';
  if (documentMap.has(href)) return documentMap.get(href);
  if (/^https:\/\/wa\.me\//i.test(href)) return normalizeWhatsAppHref(href);
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return href;
  try {
    const url = new URL(href);
    if (url.origin === originalOrigin) {
      if (url.pathname.startsWith('/_files/')) return documentMap.get(href) || href;
      return routeFromUrl(url.href);
    }
    return href;
  } catch {
    return href;
  }
}

function assetUrl(src) {
  return assetMap.get(src) || src || '';
}

function primaryImage(item, fallback = '') {
  const candidate = item.images.find((img) => {
    const alt = (img.alt || '').toLowerCase();
    return !alt.includes('hirayama horizontal') && (img.width > 220 || img.visibleWidth > 180);
  });
  return assetUrl(candidate?.src || item.ogImage || fallback);
}

function parseRssItems(xml) {
  const items = [];
  for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = match[1];
    const field = (name) => {
      const found = block.match(new RegExp(`<${name}(?: [^>]*)?>([\\s\\S]*?)<\\/${name}>`));
      return found ? decodeXml(found[1]) : '';
    };
    const enclosure = block.match(/<enclosure[^>]*url="([^"]+)"/);
    items.push({
      title: field('title'),
      description: field('description'),
      link: field('link'),
      category: field('category'),
      pubDate: field('pubDate'),
      creator: field('dc:creator') || 'Ewerton Hirayama',
      image: enclosure ? decodeXml(enclosure[1]) : ''
    });
  }
  return items;
}

function extractPost(item, rssMap, index) {
  const route = routeFromUrl(item.url);
  const rss = rssMap.get(item.url) || {};
  const lines = splitLines(item.bodyText).filter((line) => line !== '​' && line !== ' ');
  const title = item.ogTitle || rss.title || item.title.replace(/\s*\|.*$/, '');
  const titleIndex = lines.findIndex((line) => line === title || line.includes(title.slice(0, 45)));
  const readIndex = lines.findIndex((line, i) => i > Math.max(0, titleIndex) && /min de leitura/i.test(line));
  const start = readIndex >= 0 ? readIndex + 1 : Math.max(0, titleIndex + 1);
  let end = lines.findIndex((line, i) => i > start && /Leia Outras|Posts recentes|©2020|Utilizamos cookies/i.test(line));
  if (end < 0) end = lines.length;
  const bodyLines = lines.slice(start, end).filter((line) => !navLabels.has(line));
  const dateLine = lines.find((line) => /\d{1,2} de .+ de \d{4}/i.test(line)) || '';
  const minutes = lines.find((line) => /min de leitura/i.test(line)) || '';
  return {
    index,
    route,
    sourceUrl: item.url,
    title,
    description: rss.description || item.description || item.ogDescription,
    category: rss.category || '',
    pubDate: rss.pubDate || '',
    dateLine,
    minutes,
    author: rss.creator || 'Ewerton Hirayama',
    image: assetUrl(item.ogImage || rss.image || item.images.find((img) => img.width > 200)?.src || ''),
    bodyLines
  };
}

function normalizeSearch(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function articleCoverFileName(route) {
  const slug = String(route || '')
    .replace(/^\/post\//, '')
    .replace(/\/$/, '');
  return `${sanitizeFileName(slug).toLowerCase()}-${hash(route)}.png`;
}

function articleCoverImage(post, topic) {
  const fileName = articleCoverFileName(post.route);
  const aiFilePath = path.join(projectDir, 'assets', 'blog', 'article-ai-covers', fileName);
  if (existsSync(aiFilePath)) return `/assets/blog/article-ai-covers/${fileName}`;
  const filePath = path.join(projectDir, 'assets', 'blog', 'article-covers', fileName);
  return existsSync(filePath) ? `/assets/blog/article-covers/${fileName}` : topic.image;
}

const articleTopics = [
  {
    key: 'mental',
    category: 'Saúde corporativa',
    image: '/assets/blog/corporate-mental-health.png',
    match: /saude mental|nr-1|reborn|maternidade|era digital|qualidade de vida/,
    description: 'Entenda o impacto do tema na rotina das pessoas, na gestão de riscos e na tomada de decisão dentro da empresa.',
    central: 'O ponto principal é tratar saúde mental como gestão contínua, não como ação pontual quando o problema já virou urgência.',
    risk: 'O risco costuma aparecer quando a empresa reage tarde: absenteísmo, afastamentos, queda de produtividade e conflitos são sinais que precisam ser lidos em conjunto.',
    method: 'A Hirayama organiza a conversa entre cuidado, benefício, comunicação interna e risco trabalhista, para que a decisão tenha critério e acompanhamento.',
    bullets: ['impacto na rotina dos colaboradores', 'sinais de afastamento e queda de engajamento', 'responsabilidade da liderança', 'benefícios que podem apoiar o cuidado'],
    questions: [
      ['Toda ação de saúde mental resolve o problema?', 'Não. A ação precisa estar conectada ao diagnóstico real da empresa e ao acompanhamento posterior.'],
      ['O RH deve olhar só para custo?', 'Não. Custo importa, mas risco, comunicação e prevenção também pesam na decisão.']
    ],
    tags: ['#SaudeMental', '#RH', '#BeneficiosCorporativos', '#GestaoDeRiscos']
  },
  {
    key: 'auto',
    category: 'Auto',
    image: '/assets/blog/auto-insurance.png',
    match: /seguro auto|automovel|cota auto/,
    description: 'Veja como comparar seguro auto com atenção a cobertura, assistência, perfil de uso e suporte em sinistro.',
    central: 'O seguro auto não deve ser escolhido apenas pelo menor preço. A contratação precisa considerar como o carro é usado e o que realmente precisa estar protegido.',
    risk: 'O risco está em cortar coberturas importantes para reduzir a parcela e descobrir a falha só quando ocorre colisão, roubo, guincho ou dano a terceiros.',
    method: 'A Hirayama compara cenários de uso, franquia, assistência, perfil do condutor e atendimento em sinistro antes de indicar a alternativa mais adequada.',
    bullets: ['franquia e cobertura para terceiros', 'assistência 24 horas e guincho', 'perfil de uso do veículo', 'histórico de sinistro e renovação'],
    questions: [
      ['Seguro mais barato sempre compensa?', 'Nem sempre. Ele pode trazer franquia alta, assistência limitada ou cobertura insuficiente.'],
      ['Vale revisar a apólice todo ano?', 'Sim. Perfil de uso, preço do veículo e condições de mercado mudam com frequência.']
    ],
    tags: ['#SeguroAuto', '#ProtecaoPatrimonial', '#Sinistro', '#Cotacao']
  },
  {
    key: 'consortium',
    category: 'Crédito planejado',
    image: '/assets/blog/consortium-credit.png',
    match: /consorcio|rodobens|financiamento|credito planejado|plano pontual/,
    description: 'Entenda quando consórcio, crédito planejado e financiamento fazem sentido dentro de uma decisão de médio e longo prazo.',
    central: 'O consórcio funciona melhor quando existe planejamento. Ele não é só uma parcela menor: é uma estratégia de acesso a crédito com regras próprias.',
    risk: 'O risco está em contratar esperando liquidez imediata sem entender contemplação, lance, prazo, correção da carta e custo total.',
    method: 'A Hirayama traduz o contrato para cenários práticos: urgência, capacidade de pagamento, objetivo do crédito e impacto da carta ao longo do tempo.',
    bullets: ['prazo e objetivo da carta', 'possibilidade de lance', 'correção e custo total', 'necessidade real de liquidez'],
    questions: [
      ['Consórcio substitui financiamento?', 'Depende da urgência. Para compra imediata, a análise precisa comparar prazo, juros e contemplação.'],
      ['A menor parcela é sempre melhor?', 'Não. É preciso avaliar prazo, taxa, reajuste e valor final da carta.']
    ],
    tags: ['#Consorcio', '#CreditoPlanejado', '#Financiamento', '#PlanejamentoFinanceiro']
  },
  {
    key: 'benefits',
    category: 'Benefícios e RH',
    image: '/assets/blog/corporate-benefits.png',
    match: /vale|cartao|cartoes|cashback|beneficio|beneficios|premiacao|rh|inss|reforma tributaria|alimentacao|whatsapp business|industria quimica/,
    description: 'Veja como estruturar benefícios corporativos com critério, evitando decisões frágeis para RH, financeiro e colaboradores.',
    central: 'Benefício corporativo não é apenas fornecedor e preço. Ele envolve regra, comunicação, adesão, experiência do colaborador e responsabilidade da empresa.',
    risk: 'O risco aparece quando a empresa escolhe um benefício sem validar regra fiscal, convenção coletiva, PAT, comunicação interna ou impacto na folha.',
    method: 'A Hirayama conecta RH, financeiro e liderança para comparar alternativas, organizar comunicação e reduzir ruído depois da implantação.',
    bullets: ['regra fiscal e trabalhista aplicável', 'perfil dos colaboradores', 'comunicação e uso do benefício', 'governança entre RH e financeiro'],
    questions: [
      ['Todo benefício reduz custo automaticamente?', 'Não. O desenho precisa respeitar regras e fazer sentido para o público interno.'],
      ['Comunicação influencia o resultado?', 'Sim. Benefício mal comunicado vira dúvida, baixa adesão e retrabalho para o RH.']
    ],
    tags: ['#BeneficiosCorporativos', '#RH', '#ValeAlimentacao', '#GestaoDePessoas']
  },
  {
    key: 'risk',
    category: 'Risco empresarial',
    image: '/assets/blog/business-risk-credit.png',
    match: /seguro de credito|grande cliente|entregas|vendas a prazo|inadimplencia|cliente pede/,
    description: 'Entenda como proteger receita, vendas a prazo e decisões comerciais antes que um problema financeiro vire crise.',
    central: 'Risco empresarial precisa ser tratado antes do atraso, do cancelamento ou da inadimplência. Depois do problema instalado, as opções ficam mais caras e limitadas.',
    risk: 'O risco está em concentrar faturamento, liberar crédito no automático ou depender de poucos clientes sem enxergar o efeito no caixa.',
    method: 'A Hirayama ajuda a organizar a leitura de exposição, carteira de clientes, política comercial e alternativas de proteção para dar previsibilidade ao negócio.',
    bullets: ['concentração de clientes', 'política de crédito e cobrança', 'exposição do contas a receber', 'impacto no fluxo de caixa'],
    questions: [
      ['Seguro de crédito é só para grandes empresas?', 'Não necessariamente. O ponto é avaliar volume, concentração e exposição das vendas a prazo.'],
      ['O comercial deve participar da análise?', 'Sim. A decisão envolve venda, financeiro e gestão de risco ao mesmo tempo.']
    ],
    tags: ['#SeguroDeCredito', '#RiscoEmpresarial', '#FluxoDeCaixa', '#Inadimplencia']
  },
  {
    key: 'international',
    category: 'Saúde internacional',
    image: '/assets/blog/international-health.png',
    match: /seguro saude internacional|saude internacional|morando fora|fora do brasil|cartao de credito x seguro saude|seguro do cartao/,
    description: 'Veja os pontos que realmente importam ao comparar seguro saúde internacional, cobertura global e limites de atendimento.',
    central: 'Seguro saúde internacional exige atenção a território, elegibilidade, rede, reembolso e exclusões. O nome do produto sozinho não garante boa proteção.',
    risk: 'O risco é confundir seguro viagem, benefício do cartão e cobertura médica internacional completa, principalmente em viagens longas ou mudança de país.',
    method: 'A Hirayama organiza a análise por uso real: onde a pessoa mora ou viaja, quais hospitais pretende acessar, qual orçamento cabe e qual risco não pode ficar descoberto.',
    bullets: ['país de residência e país de uso', 'rede direta e reembolso', 'limites, franquias e exclusões', 'diferença entre viagem e cobertura médica contínua'],
    questions: [
      ['Seguro do cartão substitui seguro saúde internacional?', 'Em geral, não. Ele costuma ter limites, prazos e condições mais restritas.'],
      ['Dá para contratar já estando fora do Brasil?', 'Depende da seguradora, residência, elegibilidade e momento da contratação.']
    ],
    tags: ['#SaudeInternacional', '#SeguroSaudeInternacional', '#Expatriados', '#Viagem']
  },
  {
    key: 'protection',
    category: 'Proteção pessoal',
    image: '/assets/blog/protection-planning.png',
    match: /previdencia|responsabilidade civil|blindagem|seguro de vida|profissional moderno/,
    description: 'Entenda como previdência, responsabilidade civil e proteção pessoal entram em um planejamento mais seguro.',
    central: 'Proteção pessoal não é uma compra isolada. Ela precisa conversar com carreira, família, patrimônio, sucessão e exposição profissional.',
    risk: 'O risco está em contratar por impulso, sem entender cobertura, prazo, beneficiários, portabilidade, carência ou limites de responsabilidade.',
    method: 'A Hirayama traduz as opções para decisões práticas, comparando objetivo, prazo, custo, liquidez e impacto para a família ou atividade profissional.',
    bullets: ['objetivo da proteção', 'beneficiários e sucessão', 'limites de cobertura', 'prazo e flexibilidade do plano'],
    questions: [
      ['Previdência pode ser portada?', 'Sim, mas é preciso avaliar regime, taxa, tributação e estratégia antes de mover o plano.'],
      ['Responsabilidade civil é só para grandes empresas?', 'Não. Profissionais autônomos e liberais também podem ter exposição relevante.']
    ],
    tags: ['#SeguroDeVida', '#Previdencia', '#ResponsabilidadeCivil', '#Planejamento']
  },
  {
    key: 'health',
    category: 'Planos de saúde',
    image: '/assets/blog/health-plan-consulting.png',
    match: /plano de saude|ans|amil|unimed|sinistralidade|preexistente|permanencia|rede d|descredencia|cartoes de desconto|operadora|beneficiarios/,
    description: 'Entenda como avaliar plano de saúde com atenção a rede, contrato, reajuste, uso e suporte depois da contratação.',
    central: 'Plano de saúde não é só tabela de preço. A melhor escolha depende de rede, perfil de uso, carência, reajuste, contrato e qualidade do suporte.',
    risk: 'O risco aparece quando a decisão é tomada por urgência ou comparação rasa de preço, sem analisar rede credenciada, histórico de uso e regras da operadora.',
    method: 'A Hirayama compara alternativas com olhar consultivo: necessidade real, cenário de reajuste, comunicação com beneficiários e acompanhamento pós-venda.',
    bullets: ['rede médica e hospitais relevantes', 'carências e regras contratuais', 'sinistralidade e reajustes', 'suporte em uso, troca e permanência'],
    questions: [
      ['Existe um melhor plano de saúde para todos?', 'Não. O melhor plano depende de perfil, região, orçamento, rede desejada e forma de contratação.'],
      ['Preço baixo deve ser o principal critério?', 'Não sozinho. Rede, contrato, reajuste e suporte costumam pesar no resultado final.']
    ],
    tags: ['#PlanoDeSaude', '#ANS', '#SaudeSuplementar', '#Reajuste']
  }
];

function articleTopic(post) {
  const haystack = normalizeSearch(`${post.title} ${post.description || ''} ${post.route || ''}`);
  if (/seguro saude internacional|saude internacional|fora do brasil|seguro do cartao/.test(haystack)) {
    return articleTopics.find((topic) => topic.key === 'international');
  }
  if (/whatsapp business|para rh|beneficios corporativos|beneficios|vale alimentacao|cartao de premiacao|cashback|fraude no inss|reforma tributaria|industria quimica/.test(haystack)) {
    return articleTopics.find((topic) => topic.key === 'benefits');
  }
  const priority = ['auto', 'consortium', 'risk', 'international', 'mental', 'health', 'protection', 'benefits'];
  return priority
    .map((key) => articleTopics.find((topic) => topic.key === key))
    .find((topic) => topic?.match.test(haystack)) || articleTopics.find((topic) => topic.key === 'health');
}

function asSentenceTitle(title) {
  return String(title || '')
    .replace(/\s+/g, ' ')
    .replace(/\s*\|\s*.*$/, '')
    .trim()
    .replace(/[.!?]+$/, '');
}

const articleProfiles = {
  mental: {
    audience: 'RHs, lideranças e empresas que precisam tratar cuidado emocional como gestão, não como campanha isolada.',
    stakes: 'A saúde mental afeta afastamentos, engajamento, produtividade, risco trabalhista e a percepção de cuidado dentro da empresa.',
    decisionLens: 'O melhor caminho combina diagnóstico, comunicação interna, benefício adequado, orientação para líderes e acompanhamento depois da implantação.',
    redFlags: ['ações pontuais sem continuidade', 'lideranças sem preparo para encaminhar casos sensíveis', 'benefícios contratados sem comunicação clara', 'ausência de indicadores de afastamento e turnover'],
    criteria: ['Mapear sinais antes de definir solução', 'Separar acolhimento, prevenção e tratamento', 'Entender o papel do RH, da liderança e do fornecedor', 'Acompanhar evolução depois da primeira ação'],
    questions: ['Quais áreas concentram afastamentos, conflitos ou queda de engajamento?', 'A liderança sabe o que fazer quando percebe um sinal de alerta?', 'O benefício contratado é conhecido e usado pelas pessoas?']
  },
  auto: {
    audience: 'pessoas e famílias que querem proteger o carro sem pagar por coberturas inúteis ou descobrir lacunas só no sinistro.',
    stakes: 'Um seguro auto mal comparado pode economizar na parcela e custar caro quando envolve franquia, terceiros, assistência ou guincho.',
    decisionLens: 'A análise precisa cruzar perfil de uso, franquia, assistência, cobertura para terceiros, região de circulação e qualidade do atendimento.',
    redFlags: ['cotação escolhida só pelo menor preço', 'cobertura para terceiros muito baixa', 'assistência 24 horas limitada', 'franquia incompatível com o orçamento'],
    criteria: ['Comparar franquia e cobertura lado a lado', 'Verificar assistência, guincho e carro reserva', 'Entender perfil real de uso do veículo', 'Revisar a apólice a cada renovação'],
    questions: ['O carro é usado para trabalho, família ou viagens?', 'Qual prejuízo você conseguiria absorver sem comprometer o orçamento?', 'O suporte em sinistro é tão bom quanto o preço da proposta?']
  },
  consortium: {
    audience: 'quem quer planejar compra de veículo, imóvel ou crédito sem confundir consórcio com financiamento imediato.',
    stakes: 'A parcela pode parecer simples, mas prazo, lance, contemplação, correção e custo total mudam completamente a decisão.',
    decisionLens: 'A escolha deve começar pela urgência: se a compra precisa acontecer agora, o consórcio precisa ser comparado com outras alternativas de crédito.',
    redFlags: ['promessa de contemplação rápida como se fosse garantia', 'comparar só valor de parcela', 'ignorar correção da carta', 'entrar sem reserva para lance ou prazo'],
    criteria: ['Definir objetivo da carta', 'Comparar prazo, taxa e reajuste', 'Simular lance sem comprometer caixa', 'Entender regras antes da adesão'],
    questions: ['Você precisa do bem agora ou pode esperar?', 'A parcela cabe mesmo com reajuste?', 'Qual cenário faz sentido se a contemplação demorar?']
  },
  benefits: {
    audience: 'RHs, financeiros e líderes que precisam estruturar benefícios sem criar ruído fiscal, trabalhista ou operacional.',
    stakes: 'Benefício corporativo mexe com custo, adesão, comunicação, folha, experiência do colaborador e governança entre áreas.',
    decisionLens: 'O melhor desenho nasce de diagnóstico: perfil dos colaboradores, regras aplicáveis, orçamento, comunicação e rotina de suporte.',
    redFlags: ['fornecedor escolhido sem validar regra fiscal', 'benefício pouco entendido pelos colaboradores', 'RH assumindo dúvidas sem processo', 'promessa comercial sem análise jurídica ou financeira'],
    criteria: ['Mapear público interno e convenções', 'Comparar custo total e não só taxa', 'Planejar comunicação antes do lançamento', 'Definir responsáveis por suporte e revisão'],
    questions: ['O benefício resolve uma dor real ou só adiciona complexidade?', 'A área financeira entende o impacto?', 'Os colaboradores saberão usar a solução sem acionar o RH o tempo todo?']
  },
  risk: {
    audience: 'empresas que vendem a prazo, concentram clientes ou precisam proteger fluxo de caixa contra inadimplência e ruptura comercial.',
    stakes: 'Risco empresarial raramente aparece de uma vez: ele cresce quando a empresa depende de poucos clientes, libera crédito sem critério ou não mede exposição.',
    decisionLens: 'A decisão deve combinar carteira, concentração, política de crédito, histórico de pagamento, margem e alternativas de proteção.',
    redFlags: ['cliente grande concentrando faturamento', 'vendas liberadas no automático', 'ausência de política de crédito', 'cobrança começando só depois do atraso'],
    criteria: ['Medir concentração por cliente', 'Definir limites de crédito', 'Separar venda de risco financeiro', 'Criar resposta antes da inadimplência'],
    questions: ['Quanto do faturamento depende de poucos clientes?', 'O comercial sabe quando uma venda aumenta risco demais?', 'Qual seria o efeito de um atraso grande no caixa?']
  },
  international: {
    audience: 'famílias, executivos, estudantes, expatriados e empresas que precisam entender cobertura médica fora do Brasil com clareza.',
    stakes: 'Seguro viagem, benefício de cartão e seguro saúde internacional têm escopos diferentes; confundir esses produtos pode deixar risco descoberto.',
    decisionLens: 'A análise precisa partir de residência, tempo fora, países de uso, rede desejada, reembolso, elegibilidade e exclusões.',
    redFlags: ['usar benefício do cartão como cobertura principal', 'contratar sem olhar território e prazo', 'não entender reembolso e franquia', 'viajar com condição médica sem validar cobertura'],
    criteria: ['Definir país de residência e países de uso', 'Comparar rede direta e reembolso', 'Checar limites e exclusões', 'Entender se a cobertura é temporária ou contínua'],
    questions: ['A pessoa vai viajar, morar fora ou circular entre países?', 'Qual hospital ou rede seria importante acessar?', 'O orçamento comporta franquia e reembolso?']
  },
  protection: {
    audience: 'profissionais, famílias e empresários que querem proteger renda, patrimônio, sucessão e responsabilidade pessoal com critério.',
    stakes: 'Proteção pessoal mal planejada pode deixar família, carreira e patrimônio expostos justamente quando a pessoa mais precisa de liquidez e clareza.',
    decisionLens: 'A escolha deve conectar objetivo, prazo, beneficiários, liquidez, tributação, responsabilidade civil e capacidade de pagamento.',
    redFlags: ['contratar sem revisar beneficiários', 'olhar só prêmio mensal', 'ignorar exclusões e carências', 'não conectar proteção com sucessão ou carreira'],
    criteria: ['Definir o que precisa ser protegido', 'Revisar beneficiários e prazos', 'Comparar liquidez, carência e exclusões', 'Avaliar impacto para família e atividade profissional'],
    questions: ['Quem dependeria financeiramente de você?', 'Qual risco profissional poderia gerar prejuízo relevante?', 'A proteção atual acompanha seu momento de vida?']
  },
  health: {
    audience: 'famílias, empresas, RHs e beneficiários que precisam decidir sobre plano de saúde com mais critério do que tabela de preço.',
    stakes: 'Rede, contrato, carência, reajuste, sinistralidade e suporte pós-venda podem pesar mais no resultado do que a mensalidade inicial.',
    decisionLens: 'A comparação correta cruza necessidade real, região, rede desejada, regras contratuais, uso provável e capacidade de acompanhar mudanças depois da contratação.',
    redFlags: ['decisão tomada só por preço', 'rede hospitalar não conferida', 'carências e regras ignoradas', 'ausência de suporte para reembolso, troca ou permanência'],
    criteria: ['Conferir rede médica relevante', 'Entender carência e regras contratuais', 'Projetar reajuste e sinistralidade', 'Planejar suporte no uso real'],
    questions: ['Quais hospitais e médicos são indispensáveis?', 'A contratação é individual, familiar, adesão ou empresarial?', 'Quem acompanhará problemas de rede, reajuste ou uso?']
  }
};

function buildArticleContent(topic, title) {
  const profile = articleProfiles[topic.key] || articleProfiles.health;
  const cleanTitle = title.replace(/^["“”]+|["“”]+$/g, '');
  const decisionCards = [
    ['O que está em jogo', profile.stakes],
    ['Onde costuma falhar', topic.risk],
    ['Como olhar com método', profile.decisionLens]
  ];
  const sections = [
    {
      id: 'contexto',
      title: 'Contexto antes da cotação',
      paragraphs: [
        `O tema "${cleanTitle}" não deveria começar pela pergunta "quanto custa?". Antes disso, é preciso entender quem será impactado, qual risco está sendo administrado e que consequência aparece se a decisão for tomada depressa demais.`,
        `Na prática, a decisão envolve ${profile.audience} Quando esse contexto fica claro, a conversa deixa de ser uma busca por produto e passa a ser uma análise de cenário.`,
        'Esse cuidado muda a qualidade da contratação. Em vez de comparar propostas soltas, a empresa ou a família passa a enxergar o que cada alternativa resolve, o que ela não resolve e quais pontos exigem acompanhamento depois.'
      ]
    },
    {
      id: 'diagnostico',
      title: 'O diagnóstico muda a proposta',
      paragraphs: [
        topic.central,
        'Um bom diagnóstico separa urgência de prioridade. Algumas decisões precisam de resposta rápida; outras precisam de revisão de contrato, leitura de histórico, conversa com áreas internas e validação de regras antes de qualquer assinatura.',
        'É aqui que a consultoria evita ruído. O papel não é empurrar uma solução pronta, mas organizar perguntas, comparar impactos e mostrar onde a economia aparente pode virar custo oculto.'
      ]
    },
    {
      id: 'criterios',
      title: 'Critérios que merecem atenção',
      intro: 'Use estes pontos como um filtro inicial antes de comparar propostas:',
      list: profile.criteria,
      paragraphs: [
        'Esses critérios não substituem uma análise completa, mas ajudam a tirar a decisão do improviso. Quando eles são ignorados, a escolha tende a depender de preço, indicação informal ou pressão comercial.',
        topic.method
      ]
    },
    {
      id: 'alertas',
      title: 'Sinais de alerta',
      intro: 'Antes de avançar, vale parar se algum destes pontos aparecer:',
      list: profile.redFlags,
      paragraphs: [
        'Um sinal de alerta não significa que a contratação está errada. Ele indica que existe uma pergunta sem resposta, uma regra que precisa ser confirmada ou um risco que ainda não entrou na conta.',
        'O problema geralmente nasce quando esses sinais são tratados como detalhe. Depois da contratação, detalhes viram atrito: dúvida no uso, negativa, reajuste, retrabalho para o RH, sinistro mal conduzido ou custo que não estava previsto.'
      ]
    },
    {
      id: 'decisao',
      title: 'Como transformar análise em decisão',
      paragraphs: [
        'A decisão mais segura costuma seguir uma sequência simples: entender o cenário, comparar alternativas equivalentes, validar riscos, escolher o caminho e acompanhar o pós-venda. Parece básico, mas é exatamente onde muitas contratações se perdem.',
        'Para empresas, esse processo também precisa envolver as áreas certas. RH, financeiro, liderança, jurídico e operação podem enxergar impactos diferentes da mesma contratação. Para famílias, a conversa passa por orçamento, rede, dependentes e tranquilidade no uso real.',
        'O objetivo final não é contratar o produto mais sofisticado. É escolher uma solução que continue fazendo sentido depois da assinatura, quando surgem dúvidas, uso, reajuste, sinistro, troca de cenário ou novas necessidades.'
      ]
    },
    {
      id: 'plano-acao',
      title: 'Plano de ação recomendado',
      intro: 'Para sair da dúvida e chegar a uma decisão comparável, siga esta ordem:',
      list: [
        'Levante o cenário atual antes de pedir proposta',
        'Defina o que é indispensável e o que é apenas desejável',
        'Compare alternativas usando os mesmos critérios',
        'Registre dúvidas, exclusões, prazos e pontos de suporte',
        'Decida com uma visão de uso real, não só de contratação'
      ],
      paragraphs: [
        'Esse roteiro evita que a conversa seja dominada por preço, pressa ou promessa comercial. Quando os critérios ficam visíveis, a proposta deixa de ser uma peça isolada e passa a ser parte de uma decisão mais organizada.',
        'Também ajuda a identificar quando duas alternativas parecem parecidas, mas entregam resultados diferentes. Uma pode ter preço menor e suporte limitado; outra pode custar um pouco mais, mas reduzir retrabalho, ruído e risco no uso.'
      ]
    },
    {
      id: 'acompanhamento',
      title: 'O que acompanhar depois da escolha',
      intro: 'Depois da contratação, monitore especialmente:',
      list: [
        'dúvidas recorrentes dos usuários ou beneficiários',
        'mudanças de custo, reajuste, rede, regra ou fornecedor',
        'qualidade do suporte quando aparece um problema',
        'aderência da solução ao cenário que motivou a contratação'
      ],
      paragraphs: [
        'A contratação não termina no aceite da proposta. O pós-venda revela se a decisão foi bem desenhada: é ali que aparecem dúvidas, necessidade de ajuste, mudança de perfil, sinistro, reembolso, utilização, comunicação interna ou revisão de contrato.',
        'Por isso, uma corretora consultiva não deveria desaparecer depois da venda. O acompanhamento protege a decisão tomada e cria histórico para a próxima revisão. Com histórico, a conversa seguinte fica mais madura, menos reativa e muito mais estratégica.'
      ]
    }
  ];
  return {
    summary: `Uma boa decisão sobre ${topic.category.toLowerCase()} começa quando o assunto sai do achismo e entra em método. Este artigo organiza os pontos que ajudam a avaliar "${cleanTitle}" com mais clareza, menos pressa e mais atenção ao que acontece depois da contratação.`,
    decisionCards,
    sections,
    questions: profile.questions,
    faq: topic.questions,
    note: 'Conteúdo educativo. As regras e condições podem variar por seguradora, operadora, produto, contrato, região e perfil de contratação.',
    closing: 'Se a conversa já chegou nesse nível de detalhe, provavelmente vale mapear o cenário antes de pedir uma proposta. Diagnóstico primeiro, produto depois.'
  };
}

function enhancePost(post) {
  const topic = articleTopic(post);
  const title = asSentenceTitle(post.title);
  post.category = post.category || topic.category;
  post.description = post.description || topic.description;
  post.image = post.image || articleCoverImage(post, topic);
  post.minutes = post.minutes || (post.readTime ? `${post.readTime} min de leitura` : '6 min de leitura');
  post.visualAlt = `${topic.category}: ${title}`;
  post.tags = post.tags || post.hashtags || topic.tags;
  post.articleContent = buildArticleContent(topic, title);
  return post;
}

function isHeading(line, index) {
  if (index === 0) return false;
  if (line.length > 95) return false;
  if (/[:.!?]$/.test(line) && !/^\d+\./.test(line)) return false;
  if (/^(Atualizado|Fonte|www\.|https?:)/i.test(line)) return false;
  if (/^\d+\./.test(line)) return true;
  const letters = line.replace(/[^A-Za-zÀ-ú]/g, '');
  const upper = line.replace(/[^A-Za-zÀ-ú]/g, '').replace(/[a-zà-ú]/g, '').length;
  return letters.length > 4 && upper / letters.length > 0.45;
}

function renderTextBlocks(lines, mode = 'page') {
  return lines.map((line, index) => {
    const text = escapeHtml(line);
    if (/^[•\-]\s+/.test(line)) return `<p class="bullet">${text.replace(/^[•\-]\s+/, '')}</p>`;
    if (mode === 'article' && line.length < 70 && !/[.!?]$/.test(line)) return `<h2>${text}</h2>`;
    if (isHeading(line, index)) return `<h2>${text}</h2>`;
    return `<p>${text}</p>`;
  }).join('\n');
}

function renderArticleContent(post) {
  const content = post.articleContent;
  if (!content) return renderTextBlocks(post.bodyLines || [], 'article');
  return `
          <section class="article-brief" id="resumo">
            <p class="article-kicker">Resumo executivo</p>
            <h2>Antes de decidir, entenda o cenário.</h2>
            <p>${escapeHtml(content.summary)}</p>
          </section>
          <section class="article-scan-grid" aria-label="Principais pontos">
            ${content.decisionCards.map(([title, text]) => `<article>
              <span>${escapeHtml(title)}</span>
              <p>${escapeHtml(text)}</p>
            </article>`).join('')}
          </section>
          ${content.sections.map((section) => `<section class="article-section" id="${escapeHtml(section.id)}">
            <p class="article-kicker">${escapeHtml(section.title)}</p>
            <h2>${escapeHtml(section.title)}</h2>
            ${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
            ${section.list ? `<div class="article-check-panel">
              ${section.intro ? `<p>${escapeHtml(section.intro)}</p>` : ''}
              <ul class="article-checklist">
                ${section.list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
              </ul>
            </div>` : ''}
          </section>`).join('')}
          <section class="article-question-panel" id="perguntas">
            <div>
              <p class="article-kicker">Perguntas de diagnóstico</p>
              <h2>O que precisa estar claro antes da proposta?</h2>
            </div>
            <ul>
              ${content.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join('')}
            </ul>
          </section>
          <section class="article-note">
            <strong>Atenção</strong>
            <p>${escapeHtml(content.note)}</p>
          </section>
          <section class="article-faq" id="faq">
            <p class="article-kicker">Perguntas frequentes</p>
            <h2>Dúvidas comuns sobre o tema</h2>
            ${content.faq.map(([question, answer]) => `<details>
              <summary>${escapeHtml(question)}</summary>
              <p>${escapeHtml(answer)}</p>
            </details>`).join('')}
          </section>
          <section class="article-closing">
            <h2>Diagnóstico primeiro, produto depois.</h2>
            <p>${escapeHtml(content.closing)}</p>
            <a class="btn" href="/cote-agora/">Conversar com a Hirayama</a>
          </section>`;
}

function renderCtas(links, compact = false) {
  if (!links.length) return '';
  const className = compact ? 'actions compact' : 'actions';
  return `<div class="${className}">${links.map((link, index) => {
    const secondary = index > 0 ? ' secondary' : '';
    return `<a class="btn${secondary}" href="${escapeHtml(link.href)}"${/^https?:/.test(link.href) ? ' target="_blank" rel="noopener"' : ''}>${escapeHtml(link.text)}</a>`;
  }).join('')}</div>`;
}

function renderServiceOptions(defaultValue = 'diagnostico') {
  return contactServiceOptions.map(([value, label]) => {
    const selected = value === defaultValue ? ' selected' : '';
    return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(label)}</option>`;
  }).join('');
}

function renderContactForm({ source = 'site', compact = false } = {}) {
  return `<form class="contact-form${compact ? ' contact-form-compact' : ''}" action="${escapeHtml(formspreeEndpoint)}" method="POST" data-contact-form>
        <input type="hidden" name="_subject" value="[Site Hirayama Corretora] Novo contato">
        <input type="hidden" name="site_id" value="hirayama_corretora">
        <input type="hidden" name="origem" value="${escapeHtml(source)}">
        <label>Nome<input name="nome" autocomplete="name" required></label>
        <label>Email<input type="email" name="email" autocomplete="email" required></label>
        <label>Telefone<input name="telefone" autocomplete="tel"></label>
        <label>Serviço
          <select name="servico" required>
            ${renderServiceOptions()}
          </select>
        </label>
        <label>Mensagem<textarea name="message" rows="${compact ? '4' : '5'}">Quero falar com a Hirayama Corretora.</textarea></label>
        <label class="consent-row">
          <input type="checkbox" name="consentimento" value="sim" checked>
          <span>Autorizo o contato da Hirayama Corretora pelos dados informados.</span>
        </label>
        <p class="form-status" data-form-status aria-live="polite"></p>
        <button class="btn" type="submit">Enviar solicitação</button>
      </form>`;
}

function renderExitContactPopup() {
  return `<div class="exit-popup" data-exit-popup aria-hidden="true">
    <div class="exit-popup-dialog" role="dialog" aria-modal="true" aria-labelledby="exit-popup-title">
      <button class="exit-popup-close" type="button" data-exit-close aria-label="Fechar popup">×</button>
      <div class="exit-popup-intro">
        <p class="eyebrow">Antes de sair</p>
        <h2 id="exit-popup-title">Quer conversar antes de decidir?</h2>
        <p>Selecione o serviço que faz sentido agora e a Hirayama retorna com uma orientação objetiva, sem empurrar produto antes do diagnóstico.</p>
        <ul>
          <li>Saúde, benefícios, crédito, consórcio e seguros</li>
          <li>Atendimento consultivo para pessoas e empresas</li>
          <li>Retorno pelo canal informado no formulário</li>
        </ul>
      </div>
      ${renderContactForm({ source: 'popup_saida', compact: true })}
    </div>
  </div>`;
}

function renderMainNav(canonical) {
  const serviceActive = serviceNav.some(([, href]) => href.startsWith('/') && href === canonical);
  const firstLink = nav[0];
  const secondLink = nav[1];
  const remainingLinks = nav.slice(2);
  const attrsFor = (href) => /^https?:/i.test(href) ? ' target="_blank" rel="noopener"' : '';
  return `
      <a href="${firstLink[1]}"${firstLink[1] === canonical ? ' aria-current="page"' : ''}>${firstLink[0]}</a>
      <a href="${secondLink[1]}"${attrsFor(secondLink[1])}${secondLink[1] === canonical ? ' aria-current="page"' : ''}>${secondLink[0]}</a>
      <div class="nav-dropdown${serviceActive ? ' active' : ''}">
        <button class="nav-dropdown-trigger" type="button" aria-expanded="false">Serviços</button>
        <div class="dropdown-menu" aria-label="Serviços">
          ${serviceNav.map(([label, href]) => `<a href="${href}"${attrsFor(href)}${href === canonical ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
        </div>
      </div>
      ${remainingLinks.map(([label, href]) => `<a href="${href}"${href === canonical ? ' aria-current="page"' : ''}>${label}</a>`).join('')}`;
}

function layout({ title, description, route = '/', body, className = '', structuredData = [] }) {
  const canonical = route === '/' ? '/' : route;
  const schemas = Array.isArray(structuredData) ? structuredData : [structuredData];
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description || defaultMetaDescription)}">
  <meta name="theme-color" content="#103F3B">
  <link rel="icon" type="image/png" href="${escapeHtml(faviconHref)}">
  <link rel="apple-touch-icon" href="${escapeHtml(faviconHref)}">
  <link rel="stylesheet" href="/assets/styles.css?v=${assetVersion}">
  ${schemas.filter(Boolean).map((schema) => `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`).join('\n  ')}
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-8Z0Q2TZ3BM"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-8Z0Q2TZ3BM');
  </script>
  <script defer src="/assets/app.js?v=${assetVersion}"></script>
</head>
<body class="${escapeHtml(className)}">
  <a class="skip-link" href="#conteudo">Ir para o conteúdo principal</a>
  <header class="site-header">
    <a class="brand" href="/" aria-label="Hirayama Corretora">
      <img src="${escapeHtml(logoSrc)}" alt="Hirayama Corretora de Seguros">
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
    <nav id="menu" class="main-nav" aria-label="Navegação principal">
      ${renderMainNav(canonical)}
    </nav>
  </header>
  <main id="conteudo">
${body}
  </main>
  <footer class="site-footer">
    <div>
      <img src="${escapeHtml(footerLogoSrc)}" alt="" class="footer-logo">
      <p class="footer-seal">${escapeHtml(ecosystemSeal)}</p>
      <p>Oferecemos produtos e serviços que proporcionam mais tranquilidade, segurança e conveniência.</p>
    </div>
    <div>
      <h2>Entre em contato</h2>
      <p><strong>São Paulo / Bela Vista / SP</strong><br>Referência comercial para atendimento corporativo.<br><strong>Matriz legal:</strong> Biritiba Mirim / Centro / SP</p>
      <p><a href="mailto:contato@hirayamacorretora.com.br">contato@hirayamacorretora.com.br</a><br>(11) 4692-2643 / (11) 9-3802-0789</p>
    </div>
    <div>
      <h2>Siga a Hirayama</h2>
      <p><a href="https://www.linkedin.com/in/ewertonhirayama" target="_blank" rel="noopener">LinkedIn</a><br><a href="https://www.facebook.com/CorretoraHirayama" target="_blank" rel="noopener">Facebook</a><br><a href="https://www.instagram.com/ewertonhirayamaoficial" target="_blank" rel="noopener">Instagram</a></p>
      <p><a href="/politica-de-privacidade/">Política de privacidade</a></p>
    </div>
  </footer>
  <div class="cookie-bar" data-cookie-bar>
    <p>Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência.</p>
    <button class="btn small" type="button" data-cookie-accept>Aceitar</button>
  </div>
  ${renderFloatingSocials()}
  ${renderExitContactPopup()}
</body>
</html>`;
}

const socialIcons = {
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5.001 2.5 2.5 0 0 0 0-5zM3 9h4v12H3V9zm7 0h3.83v1.64h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V21h-4v-5.56c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.13 1.44-2.13 2.93V21h-4V9z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.6 2h8.8A5.6 5.6 0 0 1 22 7.6v8.8a5.6 5.6 0 0 1-5.6 5.6H7.6A5.6 5.6 0 0 1 2 16.4V7.6A5.6 5.6 0 0 1 7.6 2zm0 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.85a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.5v-7l6.2 3.5-6.2 3.5z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 2c.36 3.08 2.08 4.92 5.03 5.12v3.44a8.58 8.58 0 0 1-5.03-1.63v6.5c0 3.3-2.01 6.54-6.3 6.54-3.62 0-6.02-2.47-6.02-5.65 0-3.54 2.86-5.82 6.7-5.47v3.55c-1.76-.27-3.08.55-3.08 1.86 0 1.12.88 1.86 2.14 1.86 1.51 0 2.46-.83 2.46-2.78V2h4.1z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 8.1V6.4c0-.82.54-1.01.92-1.01H17V2.15L14.42 2C11.56 2 10.9 4.14 10.9 5.5v2.6H8.5v3.6h2.4V22h3.9V11.7h2.65l.35-3.6h-3.6z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .16 5.33.16 11.9c0 2.1.55 4.16 1.6 5.98L0 24l6.28-1.64a11.9 11.9 0 0 0 5.8 1.48h.01c6.57 0 11.91-5.34 11.91-11.91a11.84 11.84 0 0 0-3.48-8.45zM12.09 21.83h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.22-3.72.97.99-3.63-.24-.37a9.87 9.87 0 0 1-1.52-5.3c0-5.46 4.44-9.9 9.9-9.9a9.84 9.84 0 0 1 7 2.9 9.84 9.84 0 0 1 2.9 7.02c0 5.46-4.44 9.9-9.9 9.9zm5.43-7.42c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.3.18-1.42-.08-.13-.27-.2-.57-.35z"/></svg>'
};

function socialIcon(name) {
  return socialIcons[name] || '';
}

function renderFloatingSocials() {
  const links = [
    ['LinkedIn', 'https://www.linkedin.com/in/ewertonhirayama/', 'linkedin'],
    ['YouTube', 'https://www.youtube.com/@HirayamaCorretora', 'youtube'],
    ['Instagram', 'https://www.instagram.com/ewertonhirayamaoficial', 'instagram'],
    [
      'Falar no WhatsApp',
      whatsappHref(),
      'whatsapp'
    ]
  ];

  return `<nav class="floating-socials" aria-label="Redes sociais rápidas">
    ${links.map(([label, href, icon]) => `<a class="floating-social-button floating-${escapeHtml(icon)}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">
      ${socialIcon(icon)}
      <span class="sr-only">${escapeHtml(label)}</span>
      <span class="floating-tooltip" aria-hidden="true">${escapeHtml(label)}</span>
    </a>`).join('')}
  </nav>`;
}

function renderLinksPage() {
  const siteLinks = [
    ['Seguro de Crédito', creditSiteUrl, 'SC', ''],
    ['Consultoria RH', vrSiteUrl, 'RH', ''],
    ['Seguro Saúde', healthSiteUrl, 'SS', ''],
    ['Consórcio Platinum', consortiumSiteUrl, 'CP', ''],
    ['Hirayama Corretora', '/', 'HC', '']
  ];
  const socialLinks = [
    ['LinkedIn', 'https://www.linkedin.com/in/ewertonhirayama/', 'linkedin'],
    ['Instagram', 'https://www.instagram.com/ewertonhirayamaoficial/', 'instagram'],
    ['YouTube', 'https://www.youtube.com/@HirayamaCorretora', 'youtube'],
    ['TikTok', 'https://www.tiktok.com/@ewertonhirayama', 'tiktok'],
    ['Facebook', 'https://www.facebook.com/CorretoraHirayama', 'facebook']
  ];

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Links | Ewerton Hirayama</title>
  <meta name="description" content="Links rápidos de Ewerton Hirayama e Hirayama Corretora de Seguros.">
  <link rel="icon" type="image/png" href="${escapeHtml(faviconHref)}">
  <link rel="apple-touch-icon" href="${escapeHtml(faviconHref)}">
  <link rel="stylesheet" href="/assets/styles.css?v=${assetVersion}">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-8Z0Q2TZ3BM"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-8Z0Q2TZ3BM');
  </script>
</head>
<body class="links-page">
  <main class="links-stage" aria-label="Links de Ewerton Hirayama">
    <section class="links-card">
      <img class="links-avatar" src="${escapeHtml(`${ewertonPhoto}?v=${assetVersion}`)}" alt="Ewerton Hirayama">
      <p class="links-kicker">EWERTON HIRAYAMA</p>
      <h1>Benefícios corporativos, saúde e decisões que não admitem achismo</h1>
      <div class="links-list">
        ${siteLinks.map(([label, href, code, tone]) => `<a class="bio-link ${tone}" href="${escapeHtml(href)}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''}>
          <span class="bio-link-code">${escapeHtml(code)}</span>
          <span>${escapeHtml(label)}</span>
          <span aria-hidden="true">→</span>
        </a>`).join('')}
      </div>
      <nav class="links-socials" aria-label="Redes sociais">
        ${socialLinks.map(([label, href, icon]) => `<a class="social-button social-${escapeHtml(icon)}" href="${escapeHtml(href)}" target="_blank" rel="noopener" aria-label="${escapeHtml(label)}">
          ${socialIcon(icon)}
        </a>`).join('')}
      </nav>
      <a class="links-site" href="/">hirayamacorretora.com.br</a>
    </section>
  </main>
</body>
</html>`;
}

function renderHome(item, posts = []) {
  const heroSideSlides = heroSideGallery.map(([src, alt, tag, label, href, position]) => ({
    src: `${src}?v=${assetVersion}`,
    alt,
    tag,
    label,
    href,
    position
  }));
  const ewertonImage = `${ewertonPhoto}?v=${assetVersion}`;
  const partnerLoop = [...curatedPartners, ...curatedPartners];
  const platinumAutoSteps = [
    ['Objetivo patrimonial', 'Definimos se a carta será usada para imóvel, automóvel ou investimento antes de escolher grupo.'],
    ['Escolha da administradora', 'Comparamos Porto Consórcio e Rodobens por regras, prazo, parcela e aderência ao objetivo.'],
    ['Estratégia de lance', 'Organizamos reserva, momento de oferta e cenários de contemplação para não depender de improviso.'],
    ['Acompanhamento até a carta', 'A Hirayama segue junto na leitura do grupo, contemplação e uso da carta no bem escolhido.']
  ];
  const platinumAutoPartners = [
    ['Imóveis', 'Compra, troca ou planejamento patrimonial com carta de crédito estruturada.', ''],
    ['Automóveis', 'Carro, moto ou utilitário com estratégia para fugir do financiamento tradicional.', ''],
    ['Investimentos', 'Uso do consórcio como ferramenta de construção patrimonial com método.', '']
  ];
  const serviceShowcase = [
    {
      theme: 'platinum',
      icon: 'CP',
      serviceName: 'Consórcio Platinum',
      eyebrow: 'Consórcio Platinum',
      title: 'Estratégia inteligente para construir patrimônio.',
      text: 'Imóveis, automóveis e investimentos entram em um plano de carta de crédito, prazo, lance e acompanhamento sem depender do financiamento tradicional.',
      label: 'Método Platinum',
      primaryHref: consortiumSiteUrl,
      primaryLabel: 'Simular consórcio',
      secondaryHref: '/consórcio/',
      secondaryLabel: 'Ver detalhes',
      points: platinumAutoSteps,
      badges: platinumAutoPartners.map(([title]) => title)
    },
    {
      theme: 'health',
      icon: '+',
      serviceName: 'Plano de Saúde Internacional',
      eyebrow: 'Plano de Saúde Internacional',
      title: 'Saúde com comparação real antes da contratação.',
      text: 'Rede, reembolso, carência, reajuste, cobertura internacional e perfil de uso entram na análise antes de escolher uma operadora ou trocar de plano.',
      label: 'O que analisar',
      primaryHref: healthSiteUrl,
      primaryLabel: 'Abrir Saúde Internacional',
      secondaryHref: '/cote-agora/',
      secondaryLabel: 'Falar com a equipe',
      points: [
        ['Rede e reembolso', 'Entender hospitais, laboratórios, limites e regras antes de decidir só pelo preço.'],
        ['Uso familiar ou empresarial', 'Comparar plano individual, adesão ou empresa conforme idade, rotina e dependentes.'],
        ['Conteúdo especializado', 'Conectar a decisão aos materiais do projeto Saúde Internacional quando fizer sentido.']
      ]
    },
    {
      theme: 'credit',
      icon: 'R$',
      serviceName: 'Seguro de Crédito',
      eyebrow: 'Seguro de Crédito',
      title: 'Venda a prazo protegida contra inadimplência relevante.',
      text: 'Para empresas que vendem com prazo, o seguro de crédito ajuda a enxergar limite, concentração de carteira e risco comercial antes do problema virar perda.',
      label: 'Proteção comercial',
      primaryHref: creditSiteUrl,
      primaryLabel: 'Abrir Seguro de Crédito',
      secondaryHref: '/cote-agora/',
      secondaryLabel: 'Mapear risco',
      points: [
        ['Carteira de clientes', 'Avaliar concentração, limites e exposição antes de ampliar crédito comercial.'],
        ['Risco de não pagamento', 'Reduzir impacto de inadimplência relevante em vendas B2B.'],
        ['Decisão com dados', 'Conectar análise comercial, financeiro e seguro em uma conversa objetiva.']
      ]
    },
    {
      theme: 'benefits',
      icon: 'RH',
      serviceName: 'Consultoria RH',
      eyebrow: 'Consultoria RH',
      title: 'Benefícios corporativos com operação e critério.',
      text: 'VA, VR, cartões, campanhas e soluções para colaboradores entram em uma conversa de desenho, custo, adesão e rotina do RH.',
      label: 'Para o RH',
      primaryHref: vrSiteUrl,
      primaryLabel: 'Abrir Consultoria VR',
      secondaryHref: '/cote-agora/',
      secondaryLabel: 'Falar sobre benefícios',
      points: [
        ['VA, VR e cartões', 'Comparar alternativas com marcas reconhecidas e operação clara para a empresa.'],
        ['Comunicação interna', 'Apoiar o RH na implantação, dúvidas e rotina dos colaboradores.'],
        ['Custo e aderência', 'Olhar benefício como estratégia de retenção, não só como despesa mensal.']
      ]
    }
  ];
  const platinumHomePaths = [
    ['Imóveis', 'Carta para casa, apartamento, terreno ou construção com prazo e grupo escolhidos pelo objetivo patrimonial.', 'Morar ou investir'],
    ['Automóveis', 'Planejamento para carro, moto ou utilitário com leitura de parcela, lance e momento de contemplação.', 'Trocar com método'],
    ['Investimentos', 'Uso do consórcio como estratégia de construção de patrimônio, reserva planejada e diversificação.', 'Patrimônio futuro']
  ];

  const highlights = [
    ['Diagnóstico antes da proposta', 'Entendemos perfil, risco, orçamento e objetivo antes de indicar qualquer produto.'],
    ['Pós-venda ativo', 'Apoio em dúvidas, reembolsos, sinistros, alterações e renovações.'],
    ['Conteúdo educativo', 'Materiais e artigos para ajudar empresas e famílias a decidirem com mais clareza.'],
    ['Rede de parceiros', 'Acesso a seguradoras, operadoras e soluções financeiras para diferentes momentos.']
  ];

  const process = [
    ['01', 'Entendimento', 'Você conta o que precisa proteger, contratar ou revisar.'],
    ['02', 'Análise', 'A equipe compara opções, custos, coberturas, rede e riscos.'],
    ['03', 'Escolha', 'Você recebe orientação objetiva para decidir com segurança.'],
    ['04', 'Acompanhamento', 'Depois da contratação, o atendimento continua no suporte e na renovação.']
  ];

  const ewertonCards = [
    ['Diagnóstico antes de produto', 'Antes de falar em plano de saúde, VA, VR ou seguro, o cenário real da empresa é investigado.'],
    ['Custo invisível na mesa', 'Turnover, afastamento, sinistralidade e risco trabalhista entram na análise antes da cotação.'],
    ['Decisão com método', 'RHs, CFOs e líderes recebem contexto para decidir sem depender de achismo ou pressão de preço.'],
    ['Visão de longo prazo', 'A recomendação precisa continuar fazendo sentido quando a equipe envelhece e a conta muda.']
  ];

  const latestPosts = posts.slice(0, 3);

  return layout({
    title: 'INÍCIO | Hirayama Corretora de Seguros',
    description: defaultMetaDescription,
    route: '/',
    className: 'home new-home',
    body: `
    <section class="home-hero home-hero-visual" aria-label="Apresentação">
      <div class="hero-bg-rotator" data-hero-bg-rotator aria-hidden="true">
        ${heroSideSlides.map((slide, index) => `<img class="hero-bg-slide${index === 0 ? ' active' : ''}" src="${escapeHtml(slide.src)}" alt="" style="object-position: ${escapeHtml(slide.position)};">`).join('')}
      </div>
      <div class="home-hero-copy">
        <p class="eyebrow">Corretora, consultoria e acompanhamento</p>
        <h1>Decida com clareza antes de contratar.</h1>
        <p>Consórcio, saúde, seguro e consultoria.</p>
        <div class="actions">
          <a class="btn" href="/cote-agora/">Falar com a equipe</a>
          <a class="btn secondary" href="/downloads/">Ver materiais gratuitos</a>
        </div>
      </div>
      <div class="hero-bg-action-layer" aria-label="Atalho da imagem em destaque">
        ${heroSideSlides.map((slide, index) => {
          const heroExternal = /^https?:/i.test(slide.href);
          return `<a class="hero-bg-action${index === 0 ? ' active' : ''}" data-hero-bg-action href="${escapeHtml(slide.href)}"${heroExternal ? ' target="_blank" rel="noopener"' : ''}>
            <span>${escapeHtml(slide.tag)}</span>
            <strong>${escapeHtml(slide.label)}</strong>
          </a>`;
        }).join('')}
      </div>
    </section>
    <section class="service-carousel-section" id="frentes-hirayama" aria-label="Frentes de atendimento da Hirayama">
      <div class="service-carousel-head">
        <div>
          <p class="eyebrow">Áreas de atuação</p>
          <h2>Quatro caminhos para proteger, planejar e crescer com método.</h2>
          <p>Consórcio, saúde, seguro e consultoria em uma leitura direta, sem complicar a decisão.</p>
        </div>
      </div>
      <div class="service-carousel-stage">
        <button class="service-carousel-side service-carousel-side-prev" type="button" data-service-prev aria-label="Ver serviço anterior">‹</button>
        <div class="service-carousel-viewport" data-service-carousel>
          <div class="service-carousel-track">
            ${serviceShowcase.map((service, index) => {
              const primaryExternal = /^https?:/i.test(service.primaryHref);
              const secondaryExternal = /^https?:/i.test(service.secondaryHref);
              const badgesHtml = service.badges?.length ? `<div class="service-showcase-badges">${service.badges.map((badge) => `<span>${escapeHtml(badge)}</span>`).join('')}</div>` : '';
          return `<article class="service-showcase-slide service-showcase-${escapeHtml(service.theme)}" data-service-slide aria-label="${escapeHtml(service.eyebrow)}">
            <div class="service-showcase-copy">
              <div class="service-showcase-name">
                <span class="service-showcase-count">${String(index + 1).padStart(2, '0')}</span>
                <strong>${escapeHtml(service.serviceName)}</strong>
              </div>
              <h3>${escapeHtml(service.title)}</h3>
              <p>${escapeHtml(service.text)}</p>
              <div class="service-showcase-actions">
                <a class="btn" href="${escapeHtml(service.primaryHref)}"${primaryExternal ? ' target="_blank" rel="noopener"' : ''}>${escapeHtml(service.primaryLabel)}</a>
                <a class="btn secondary" href="${escapeHtml(service.secondaryHref)}"${secondaryExternal ? ' target="_blank" rel="noopener"' : ''}>${escapeHtml(service.secondaryLabel)}</a>
              </div>
            </div>
            <div class="service-showcase-panel">
              <p class="guide-label">${escapeHtml(service.label)}</p>
              <ol>
                ${service.points.map(([title, text]) => `<li><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span></li>`).join('')}
              </ol>${badgesHtml}
            </div>
          </article>`;
            }).join('')}
          </div>
        </div>
        <button class="service-carousel-side service-carousel-side-next" type="button" data-service-next aria-label="Ver próximo serviço">›</button>
      </div>
      <div class="service-carousel-dots" aria-label="Selecionar frente">
        ${serviceShowcase.map((service, index) => `<button type="button" data-service-dot="${index}" aria-label="Ver ${escapeHtml(service.eyebrow)}"${index === 0 ? ' class="active" aria-current="true"' : ''}></button>`).join('')}
      </div>
    </section>
    <section class="consortium-focus-section" id="consorcio-platinum-home" aria-label="Consórcio Platinum by Hirayama">
      <div class="consortium-focus-shell">
        <div class="consortium-focus-copy">
          <p class="eyebrow">Consórcio Platinum by Hirayama</p>
          <h2>Um plano patrimonial antes da carta de crédito.</h2>
          <p>Consórcio entra quando existe objetivo, prazo e estratégia. A Hirayama organiza imóveis, automóveis e investimentos em uma leitura de grupo, lance e acompanhamento para reduzir decisões no escuro.</p>
          <div class="consortium-focus-actions">
            <a class="btn" href="${escapeHtml(consortiumSiteUrl)}" target="_blank" rel="noopener">Simular consórcio</a>
            <a class="btn secondary" href="/consórcio/">Entender o método</a>
          </div>
        </div>
        <div class="consortium-focus-map" aria-label="Caminhos do Consórcio Platinum">
          ${platinumHomePaths.map(([title, text, label], index) => `<article>
            <span>${String(index + 1).padStart(2, '0')}</span>
            <div>
              <small>${escapeHtml(label)}</small>
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(text)}</p>
            </div>
          </article>`).join('')}
        </div>
      </div>
    </section>
    <section class="section ewerton-section" id="ewerton-hirayama">
      <div class="ewerton-profile">
        <div class="ewerton-photo-wrap">
          <img src="${escapeHtml(ewertonImage)}" alt="Ewerton Hirayama">
        </div>
        <div class="ewerton-copy">
          <p class="eyebrow">Sobre Ewerton Hirayama</p>
          <h2>Decisões sem achismo em saúde corporativa e benefícios.</h2>
          <p>Decisões sobre saúde corporativa e benefícios misturam custo, gente, risco trabalhista e consequências que aparecem lá na frente. O trabalho do Ewerton é tirar o achismo da mesa antes de qualquer contratação.</p>
          <p>Atuando de forma consultiva com RHs, CFOs e líderes, ele investiga o que está por trás do custo: turnover, afastamento, sinistralidade e a maturidade da força de trabalho. O produto vem depois, e só se fizer sentido no contexto real da empresa.</p>
          <div class="ewerton-actions">
            <a class="btn" href="${escapeHtml(whatsappHref())}" target="_blank" rel="noopener">Uma conversa antes da decisão</a>
            <a class="btn secondary" href="https://www.linkedin.com/in/ewertonhirayama/" target="_blank" rel="noopener">Ver LinkedIn</a>
          </div>
        </div>
      </div>
      <div class="ewerton-card-grid">
        ${ewertonCards.map(([title, text]) => `<article class="ewerton-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join('')}
      </div>
    </section>
    <section class="partners-marquee-section" id="parceiros">
      <div class="partners-marquee-head">
        <div>
          <p class="eyebrow">Parceiros</p>
          <h2>Alternativas com marcas reconhecidas.</h2>
        </div>
        <p>Uma rede de seguradoras, operadoras, bandeiras de benefícios e soluções corporativas para comparar caminhos sem depender de uma única proposta.</p>
      </div>
      <div class="partner-marquee" aria-label="Parceiros da Hirayama">
        <div class="partner-track">
          ${partnerLoop.map((partner, index) => `<a class="partner-pill" href="${escapeHtml(partner.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(partner.name)}"${index >= curatedPartners.length ? ' aria-hidden="true" tabindex="-1"' : ''}>
            <span class="partner-mark"><img src="${escapeHtml(partner.logo)}" alt="${escapeHtml(partner.name)}"></span>
            <span class="partner-text"><strong>${escapeHtml(partner.name)}</strong><small>${escapeHtml(partner.category)}</small></span>
          </a>`).join('')}
        </div>
      </div>
    </section>
    <section class="section info-layout">
      <div>
        <p class="eyebrow">Por que contratar com orientação</p>
        <h2>Uma boa decisão começa com boas perguntas.</h2>
        <p>Parcela, carta de crédito, rede, carência, reembolso, reajuste, regras de uso e suporte pesam no resultado. O papel da corretora é traduzir esse cenário para uma decisão mais segura.</p>
      </div>
      <div class="info-grid">
        ${highlights.map(([title, text]) => `<article><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join('')}
      </div>
    </section>
    <section class="section process-section">
      <div class="section-heading">
        <p class="eyebrow">Como funciona</p>
        <h2>Um processo simples para não decidir no impulso.</h2>
      </div>
      <div class="process-grid">
        ${process.map(([number, title, text]) => `<article><span>${number}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join('')}
      </div>
    </section>
    <section class="section business-section">
      <div>
        <p class="eyebrow">Para pessoas e empresas</p>
        <h2>Proteção pessoal, patrimonial e corporativa em uma mesma visão.</h2>
      </div>
      <div>
        <p>Clientes podem usar a Hirayama para planejar consórcio de imóveis, automóveis e investimentos, revisar vida e saúde, estruturar benefícios, organizar crédito e comparar decisões que exigem análise séria antes da contratação.</p>
        <a class="text-link" href="/downloads/">Acessar central de materiais</a>
      </div>
    </section>
    <section class="home-video-section" aria-label="Vídeos da Hirayama">
      <div class="home-video-head">
        <div>
          <p class="eyebrow">Hirayama em vídeo</p>
          <h2>Assuntos que merecem uma conversa direta.</h2>
        </div>
        <div>
          <p>Conteúdos rápidos sobre saúde, benefícios e decisões que pedem contexto antes de qualquer proposta.</p>
          <a class="text-link" href="/videos/">Ver todos os vídeos</a>
        </div>
      </div>
      <div class="home-video-list">
        ${videos.map((video, index) => `<article class="home-video-item">
          <div class="home-video-frame">${videoEmbed(video, 'home-video-player')}</div>
          <div class="home-video-copy">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <p class="cat">${escapeHtml(video.category)}</p>
            <h3>${escapeHtml(video.title)}</h3>
            <a href="https://youtube.com/shorts/${escapeHtml(video.id)}" target="_blank" rel="noopener">Assistir no YouTube <b aria-hidden="true">↗</b></a>
          </div>
        </article>`).join('')}
      </div>
    </section>
    <section class="section latest-section">
      <div class="section-heading">
        <p class="eyebrow">Conteúdo recente</p>
        <h2>Informação para decidir melhor.</h2>
      </div>
      <div class="latest-grid">
        ${latestPosts.map((post) => `<article class="post-card">
          <a class="post-card-image" href="${escapeHtml(post.route)}"><img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.visualAlt || post.title)}"></a>
          <div class="post-card-body">
            <p class="cat">${escapeHtml(post.category || 'Blog')}</p>
            <h3><a href="${escapeHtml(post.route)}">${escapeHtml(post.title)}</a></h3>
            <p>${escapeHtml(post.description || '')}</p>
            <footer><strong>${escapeHtml(post.minutes || '3 min de leitura')}</strong><span>Ler artigo</span></footer>
          </div>
        </article>`).join('')}
      </div>
    </section>`
  });
}

function renderServicePage(item, fallbackTitle) {
  const lines = cleanLines(item);
  const titleIndex = Math.max(0, lines.findIndex((line) => /SEGURO|PLANO|CONSÓRCIO/i.test(line)));
  const title = lines[titleIndex] || fallbackTitle;
  const subtitle = lines[titleIndex + 1] || item.description || '';
  const links = usefulLinks(item).filter((link) => ctaWords.test(link.text));
  const bodyLines = lines
    .slice(titleIndex + 2)
    .filter((line) => !links.some((link) => link.text === line))
    .filter((line) => !/©2020|Utilizamos cookies/i.test(line));

  return layout({
    title: item.title,
    description: item.description,
    route: routeFromUrl(item.url),
    className: 'service-page',
    body: `
    <section class="subhero">
      <div>
        <p class="eyebrow">Hirayama Corretora</p>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(subtitle)}</p>
        ${renderCtas(links.slice(0, 3), true)}
      </div>
      <img src="${escapeHtml(primaryImage(item))}" alt="${escapeHtml(title)}">
    </section>
    <section class="section article-body">
      ${renderTextBlocks(bodyLines)}
      ${renderCtas(links.slice(3), true)}
    </section>`
  });
}

function renderComingSoonPage(item, serviceName = 'Consórcio') {
  const route = item ? routeFromUrl(item.url) : '/consórcio/';
  return layout({
    title: `${serviceName} | Em breve | Hirayama Corretora`,
    description: `${serviceName} estará disponível em breve na Hirayama Corretora.`,
    route,
    className: 'coming-soon-page',
    body: `
    <section class="coming-soon-hero">
      <div class="coming-soon-panel">
        <p class="eyebrow">Serviço em preparação</p>
        <h1>${escapeHtml(serviceName)}</h1>
        <p>Estamos organizando esta área para apresentar as opções de forma clara, consultiva e sem pressa comercial.</p>
        <div class="coming-soon-actions">
          <a class="btn" href="/">Voltar para a home</a>
          <a class="btn secondary" href="${escapeHtml(whatsappHref())}" target="_blank" rel="noopener">Conversar agora</a>
        </div>
      </div>
    </section>`
  });
}

function renderConsortiumPage(item) {
  const route = consortiumSiteUrl;
  const risks = [
    ['Custo do financiamento', 'Parcelas que parecem leves no começo podem comprometer o custo final do bem e a liberdade de decisão ao longo dos anos.'],
    ['Prazo sem estratégia', 'Sem objetivo, grupo e lance bem avaliados, o cliente pode esperar mais do que precisava para acessar o crédito.'],
    ['Escolha no escuro', 'Carta, administradora, parcela e momento de uso precisam conversar com o plano patrimonial, não só com a oferta disponível.']
  ];
  const methods = [
    ['Perfil e objetivo', 'Entender se a carta será usada para imóvel, automóvel ou investimento antes de escolher grupo.'],
    ['Grupo adequado', 'Comparar Porto Consórcio, Rodobens, regras, prazo, parcela e aderência ao objetivo patrimonial.'],
    ['Estratégia de lance', 'Tratar contemplação como planejamento: quando ofertar, quanto reservar e quais cenários evitar.'],
    ['Acompanhamento', 'Manter leitura do grupo e orientar o uso da carta até a aquisição ou investimento planejado.']
  ];
  const types = [
    ['Imóveis', 'Casa, apartamento, terreno ou construção com carta de crédito alinhada ao momento patrimonial.'],
    ['Automóveis', 'Carro, moto ou utilitário com planejamento de crédito e menor dependência de financiamento tradicional.'],
    ['Empresarial', 'Equipamentos, veículos e estrutura para empresas que querem investir com planejamento.'],
    ['Investimentos', 'Estratégia para usar consórcio como ferramenta de diversificação e construção de patrimônio.']
  ];
  const partners = [
    ['Porto Consórcio', 'Tradição, marca forte e estrutura consolidada para quem busca segurança no planejamento patrimonial.'],
    ['Rodobens', 'Atuação nacional, variedade de planos e flexibilidade para diferentes objetivos de aquisição.']
  ];

  return layout({
    title: 'Consórcio Platinum | Hirayama Corretora',
    description: 'Planejamento de consórcio para imóveis, automóveis e investimentos com acompanhamento consultivo da Hirayama.',
    route,
    className: 'consortium-page',
    body: `
    <section class="consortium-hero">
      <div>
        <p class="eyebrow">Consórcio Platinum by Hirayama</p>
        <h1>Estratégia inteligente para construir patrimônio sem depender de financiamento tradicional.</h1>
        <p>Consórcio não deve ser tratado como sorte. A Hirayama organiza objetivo, prazo, grupo, lance e acompanhamento para transformar a carta de crédito em um plano viável.</p>
        <div class="consortium-tags" aria-label="Modalidades">
          <span>Imóveis</span><span>Automóveis</span><span>Investimentos</span><span>Estratégia de lance</span>
        </div>
        <div class="actions">
          <a class="btn" href="${escapeHtml(consortiumContactUrl)}">Simular consórcio</a>
          <a class="btn secondary" href="${escapeHtml(whatsappHref())}" target="_blank" rel="noopener">Conversar no WhatsApp</a>
        </div>
      </div>
    </section>
    <section class="section consortium-context">
      <div>
        <p class="eyebrow">Planejamento antes da proposta</p>
        <h2>O risco não é só pagar juros. É escolher crédito sem estratégia.</h2>
      </div>
      <p>Financiamento tradicional pode pesar no custo final, mas um consórcio mal escolhido também cobra seu preço em tempo, ansiedade e baixa chance de contemplação. A diferença está em analisar o cenário antes de assumir parcelas longas.</p>
    </section>
    <section class="section consortium-risks">
      ${risks.map(([title, text], index) => `<article>
        <span>0${index + 1}</span>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(text)}</p>
      </article>`).join('')}
    </section>
    <section class="section consortium-method">
      <div class="section-heading">
        <p class="eyebrow">Método</p>
        <h2>Assessoria estratégica do início ao fim.</h2>
        <p>Não é só uma carta de crédito. É um plano patrimonial estruturado, acompanhado até a contemplação.</p>
      </div>
      <div class="method-steps">
        ${methods.map(([title, text], index) => `<article>
          <span>${String(index + 1).padStart(2, '0')}</span>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(text)}</p>
        </article>`).join('')}
      </div>
    </section>
    <section class="section consortium-types">
      <div>
        <p class="eyebrow">Modalidades</p>
        <h2>Uma modalidade para cada objetivo, com estratégia própria.</h2>
      </div>
      <div class="type-list">
        ${types.map(([title, text]) => `<article>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(text)}</p>
        </article>`).join('')}
      </div>
    </section>
    <section class="section consortium-specialist">
      <img src="${escapeHtml(`${ewertonPhoto}?v=${assetVersion}`)}" alt="Ewerton Hirayama">
      <div>
        <p class="eyebrow">Acompanhamento consultivo</p>
        <h2>Planejamento patrimonial precisa de leitura contínua.</h2>
        <p>Com Ewerton Hirayama, a conversa começa pelo objetivo. Depois vêm a carta, o grupo e a estratégia de contemplação mais coerentes com o momento do cliente.</p>
        <ul class="consortium-credentials">
          <li>Planejamento para imóveis, automóveis e investimentos</li>
          <li>Leitura de grupo, prazo, parcela e estratégia de lance</li>
          <li>Acompanhamento consultivo até a contemplação</li>
        </ul>
      </div>
    </section>
    <section class="section consortium-partners">
      <div class="section-heading">
        <p class="eyebrow">Administradoras</p>
        <h2>Porto Consórcio e Rodobens como referências de comparação.</h2>
      </div>
      <div class="partner-briefs">
        ${partners.map(([title, text]) => `<article>
          <img src="${title === 'Porto Consórcio' ? '/assets/partners/porto-consorcio.png' : '/assets/partners/rodobens-consorcio.png'}" alt="${escapeHtml(title)}">
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(text)}</p>
        </article>`).join('')}
      </div>
    </section>
    <section class="section consortium-testimonials">
      <div class="section-heading">
        <p class="eyebrow">Experiências reais</p>
        <h2>Planejamento sério se percebe no caminho.</h2>
      </div>
      <div>
        <blockquote>“A assessoria fez toda a diferença. Consegui organizar o consórcio imobiliário com orientação estratégica.”<cite>Katia Souza</cite></blockquote>
        <blockquote>“Atendimento profissional e acompanhamento em cada etapa. Recomendo para quem busca planejamento sério.”<cite>Marcos Marinho</cite></blockquote>
      </div>
    </section>
    <section class="consortium-cta">
      <p class="eyebrow">Próximo passo</p>
      <h2>Descubra qual modalidade faz sentido para seu plano patrimonial.</h2>
      <a class="btn" href="${escapeHtml(consortiumContactUrl)}">Simular consórcio</a>
    </section>`
  });
}

function renderContact(item) {
  return layout({
    title: item.title,
    description: item.description,
    route: routeFromUrl(item.url),
    className: 'contact-page',
    body: `
    <section class="subhero">
      <div>
        <p class="eyebrow">Atendimento</p>
        <h1>Fale agora mesmo com a Hirayama!</h1>
        <p>Preencha o formulário e selecione o serviço desejado para a equipe entender o contexto antes do retorno.</p>
      </div>
      <img src="${escapeHtml(primaryImage(item))}" alt="Atendimento por telefone">
    </section>
    <section class="section contact-layout contact-layout-single">
      ${renderContactForm({ source: 'fale_conosco' })}
    </section>`
  });
}

function renderDownloads(item) {
  const docs = item.links.filter((link) => link.href.includes('/_files/') && documentMap.has(link.href));
  const images = item.images.filter((img) => !/hirayama horizontal/i.test(img.alt || '')).slice(0, docs.length);
  const descriptions = [
    'Baixe agora mesmo esse guia poderoso para te ajudar.',
    'Entender as tendências trará um diferencial para sua empresa.',
    'Oportunidade única para ter o seu crédito a partir da 6 parcela.',
    'Como transformar o WhatsApp em uma ferramenta poderosa.',
    'Guia inteligente: como escolher o carro ideal.'
  ];

  return layout({
    title: item.title,
    description: item.description,
    route: routeFromUrl(item.url),
    className: 'downloads-page',
    body: `
    <section class="page-intro">
      <p class="eyebrow">Central de materiais</p>
      <h1>Downloads</h1>
      <p>Guias exclusivos, cartilhas práticas e PDFs gratuitos para decisões mais seguras sobre benefícios, saúde e proteção corporativa.</p>
    </section>
    <section class="section download-grid">
      ${docs.map((doc, index) => `<article class="download-card">
        <img src="${escapeHtml(assetUrl(images[index]?.src || ''))}" alt="">
        <div>
          <h2>${escapeHtml(descriptions[index]?.replace(/\.$/, '') || `Material ${index + 1}`)}</h2>
          <p>${escapeHtml(descriptions[index] || 'Material gratuito da Hirayama Corretora.')}</p>
          <a class="btn small" href="${escapeHtml(documentMap.get(doc.href))}" target="_blank">Baixar</a>
        </div>
      </article>`).join('')}
    </section>`
  });
}

function renderTextPage(item, heading) {
  const lines = cleanLines(item);
  const first = lines.findIndex((line) => line.toLowerCase().includes(heading.toLowerCase().slice(0, 12)));
  const content = lines.slice(Math.max(0, first + 1));
  return layout({
    title: item.title,
    description: item.description,
    route: routeFromUrl(item.url),
    className: 'text-page',
    body: `
    <section class="page-intro narrow">
      <p class="eyebrow">Hirayama Corretora</p>
      <h1>${escapeHtml(heading)}</h1>
    </section>
    <section class="section article-body">
      ${renderTextBlocks(content)}
    </section>`
  });
}

function renderBlog(item, posts) {
  const categories = [...new Set(posts.map((post) => post.category).filter(Boolean))];
  return layout({
    title: item.title,
    description: item.description,
    route: routeFromUrl(item.url),
    className: 'blog-page',
    body: `
    <section class="blog-library">
      <div class="blog-library-head">
        <div>
          <p class="eyebrow">Biblioteca</p>
          <h1>Artigos consultivos</h1>
        </div>
        <p>Use os conteúdos para formar critério antes de qualquer conversa comercial sobre seguros, saúde, crédito, benefícios e risco.</p>
      </div>
      <div class="filter-row">${['Todos posts', ...categories].map((cat) => `<button type="button" data-filter="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join('')}</div>
      <div class="blog-grid article-grid">
      ${posts.map((post) => `<article class="post-card" data-category="${escapeHtml(post.category || 'Todos posts')}">
        <a class="post-card-image" href="${escapeHtml(post.route)}"><img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.visualAlt || post.title)}"></a>
        <div class="post-card-body">
          <p class="cat">${escapeHtml(post.category || 'Blog')}</p>
          <h2><a href="${escapeHtml(post.route)}">${escapeHtml(post.title)}</a></h2>
          <p>${escapeHtml(post.description || '')}</p>
          <footer><strong>${escapeHtml(post.minutes || '3 min de leitura')}</strong><span>Ler artigo</span></footer>
        </div>
      </article>`).join('')}
      </div>
    </section>`
  });
}

function videoEmbed(video, className = '') {
  return `<iframe class="${escapeHtml(className)}" src="https://www.youtube-nocookie.com/embed/${escapeHtml(video.id)}?rel=0" title="${escapeHtml(video.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}

function renderVideos() {
  const videoSchema = {
    '@context': 'https://schema.org',
    '@graph': videos.map((video) => ({
      '@type': 'VideoObject',
      name: video.title,
      description: video.description,
      thumbnailUrl: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
      contentUrl: `https://www.youtube.com/shorts/${video.id}`,
      uploadDate: '2026-08-23'
    }))
  };
  return layout({
    title: 'Vídeos | Hirayama Corretora de Seguros',
    description: 'Vídeos da Hirayama para entender com clareza decisões sobre saúde, benefícios, seguros, crédito e patrimônio.',
    route: '/videos/',
    className: 'videos-page',
    structuredData: [videoSchema],
    body: `
    <section class="videos-hero">
      <div>
        <p class="eyebrow">Hirayama em vídeo</p>
        <h1>Conversas que ajudam a decidir com clareza.</h1>
      </div>
      <p>Conteúdos rápidos sobre saúde, proteção, benefícios e escolhas que pedem mais contexto do que uma cotação.</p>
    </section>
    <section class="video-library" aria-label="Vídeos da Hirayama">
      ${videos.map((video, index) => `<article class="video-item">
        <div class="video-frame">${videoEmbed(video, 'video-player')}</div>
        <div class="video-copy">
          <p class="cat">${escapeHtml(video.category)}</p>
          <h2>${escapeHtml(video.title)}</h2>
          <p>${escapeHtml(video.description)}</p>
          <a class="video-watch" href="https://youtube.com/shorts/${escapeHtml(video.id)}" target="_blank" rel="noopener">Assistir no YouTube <span aria-hidden="true">↗</span></a>
          <span class="video-index">${String(index + 1).padStart(2, '0')}</span>
        </div>
      </article>`).join('')}
    </section>`
  });
}

function renderPost(post, posts) {
  const sameCategory = posts.filter((candidate) => candidate.route !== post.route && candidate.category === post.category);
  const recent = [...sameCategory, ...posts.filter((candidate) => candidate.route !== post.route && candidate.category !== post.category)].slice(0, 3);
  const articleSections = post.articleContent?.sections || [];
  const canonicalUrl = `${originalOrigin}${post.route}`;
  const imageUrl = post.image?.startsWith('http') ? post.image : `${originalOrigin}${post.image || ''}`;
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: imageUrl,
    datePublished: post.pubDate || post.publishAt || new Date().toISOString(),
    dateModified: post.pubDate || post.publishAt || new Date().toISOString(),
    author: { '@type': 'Person', name: post.author || 'Ewerton Hirayama' },
    publisher: { '@type': 'Organization', name: 'Hirayama Corretora de Seguros', url: originalOrigin },
    mainEntityOfPage: canonicalUrl,
    keywords: post.keywords || []
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: originalOrigin },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${originalOrigin}/blog/` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl }
    ]
  };
  const faqSchema = post.articleContent?.faq?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.articleContent.faq.map(([question, answer]) => ({
      '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  } : null;
  return layout({
    title: `${post.title} | Hirayama Seguros`,
    description: post.description,
    route: post.route,
    className: 'post-page',
    structuredData: [blogSchema, breadcrumbSchema, faqSchema],
    body: `
    <main class="article-shell">
      <article class="article-main">
        ${post.image ? `<img class="article-cover" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.visualAlt || post.title)}">` : ''}
        <header class="article-head">
          <div class="article-meta">
            <span class="pill">${escapeHtml(post.category || 'Blog')}</span>
            ${post.dateLine ? `<span class="pill">${escapeHtml(post.dateLine)}</span>` : ''}
            <span class="pill">${escapeHtml(post.minutes || '3 min de leitura')}</span>
          </div>
          <h1>${escapeHtml(post.title)}</h1>
          <p>${escapeHtml(post.description || '')}</p>
          <div class="author-row">
            <div class="author">
              <img class="author-photo" src="${escapeHtml(ewertonPhoto)}" alt="Ewerton Hirayama">
              <div><strong>${escapeHtml(post.author || 'Ewerton Hirayama')}</strong><span>Consultor em seguros e benefícios</span></div>
            </div>
            <button class="btn share-button" type="button" data-share data-share-title="${escapeHtml(post.title)}" data-share-text="${escapeHtml(post.description || '')}" data-share-url="${escapeHtml(post.route)}" aria-live="polite">Compartilhar</button>
          </div>
        </header>
        <div class="article-body">
          ${renderArticleContent(post)}
        </div>
        <section class="article-tags" aria-label="Hashtags">
          ${(post.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}
        </section>
      </article>
      <aside class="sidebar">
        <section class="side-card article-video" aria-label="Vídeo em destaque">
          <p class="cat">Hirayama em vídeo</p>
          <div class="article-video-frame">${videoEmbed(videos[0], 'article-video-player')}</div>
          <h3>${escapeHtml(videos[0].title)}</h3>
          <a class="text-link" href="/videos/">Ver todos os vídeos <span aria-hidden="true">→</span></a>
        </section>
        <div class="side-card article-toc">
          <p class="cat">Neste artigo</p>
          <a href="#resumo">Resumo executivo</a>
          ${articleSections.map((section) => `<a href="#${escapeHtml(section.id)}">${escapeHtml(section.title)}</a>`).join('')}
          <a href="#perguntas">Perguntas de diagnóstico</a>
          <a href="#faq">Perguntas frequentes</a>
        </div>
        <div class="side-card newsletter">
          <h3>Quando conversar faz sentido</h3>
          <p>Quando a decisão envolve custo, risco, pessoas ou patrimônio, vale mapear o cenário antes da cotação.</p>
          <a class="btn" href="/cote-agora/">Falar com a Hirayama</a>
        </div>
        <div class="side-card">
          <p class="cat">Continue entendendo</p>
          <h3>Mais artigos para você</h3>
          <div class="related-list">
            ${recent.map((item, index) => `<a href="${escapeHtml(item.route)}"><span class="related-number">${String(index + 1).padStart(2, '0')}</span><span><span>${escapeHtml(item.category || 'Blog')}</span><strong>${escapeHtml(item.title)}</strong></span></a>`).join('')}
          </div>
        </div>
        <div class="side-card">
          <h3>Perguntas para mapear seu cenário</h3>
          <p>O que você quer proteger? Quem será impactado? A decisão envolve contrato, reajuste, sinistro, benefício ou crédito?</p>
        </div>
      </aside>
    </main>`
  });
}

function renderCotaAuto(item) {
  return layout({
    title: item.title,
    description: item.description,
    route: routeFromUrl(item.url),
    className: 'service-page',
    body: `
    <section class="page-intro">
      <p class="eyebrow">Seguro Automóvel</p>
      <h1>Cota Auto</h1>
      <p>Solicite uma cotação para proteger seu veículo com o atendimento da Hirayama Corretora.</p>
      <div class="actions">
        <a class="btn" href="${escapeHtml(whatsappHref('5511938020789', whatsappAutoMessage))}" target="_blank" rel="noopener">Whatsapp Seguro Auto</a>
        <a class="btn secondary" href="/seguro-automóvel/">Informações Seguro Auto</a>
      </div>
    </section>`
  });
}

function renderNotFound() {
  return layout({
    title: 'Página não encontrada | Hirayama Seguros',
    description: 'Página não encontrada',
    route: '/404/',
    body: `
    <section class="page-intro">
      <p class="eyebrow">404</p>
      <h1>Página não encontrada</h1>
      <p>O conteúdo solicitado não está disponível neste clone local.</p>
      <a class="btn" href="/">Voltar ao início</a>
    </section>`
  });
}

async function downloadRemote(url, folder, preferredName = '') {
  if (!url || url.startsWith('data:')) return '';
  const targetMap = folder === 'docs' ? documentMap : assetMap;
  if (targetMap.has(url)) return targetMap.get(url);

  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 Hirayama static clone'
      },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    const parsed = new URL(url);
    const originalName = preferredName || path.basename(parsed.pathname) || 'asset';
    const fallbackExt = path.extname(originalName) || (folder === 'docs' ? '.pdf' : '.jpg');
    const ext = extFromContentType(response.headers.get('content-type'), fallbackExt);
    const fileName = `${sanitizeFileName(originalName).replace(/\.[^.]+$/, '')}-${hash(url)}${ext}`;
    const rel = `/assets/${folder}/${fileName}`;
    await fs.mkdir(path.join(outDir, 'assets', folder), { recursive: true });
    await fs.writeFile(path.join(outDir, 'assets', folder, fileName), buffer);
    targetMap.set(url, rel);
    return rel;
  } catch (error) {
    console.warn(`Could not download ${url}: ${error.message}`);
    targetMap.set(url, url);
    return url;
  }
}

async function writeRoute(route, html) {
  const file = route === '/404/' ? path.join(outDir, '404.html') : routeFile(route);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html, 'utf8');
}

async function main() {
  const sourcePath = (await Promise.all(sourceCandidates.map(async (candidate) => ((await exists(candidate)) ? candidate : '')))).find(Boolean);
  if (!sourcePath) {
    const committedSiteIndex = path.join(outDir, 'index.html');
    if (await exists(committedSiteIndex)) {
      console.log('Source data not found. Using committed site/ output.');
      return;
    }
    throw new Error('Source data not found. Expected source-data.json or .codex-tmp/hirayama-source-data.json.');
  }

  const data = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(path.join(outDir, 'assets'), { recursive: true });
  const partnerAssetDir = path.join(projectDir, 'assets', 'partners');
  if (await exists(partnerAssetDir)) {
    await fs.cp(partnerAssetDir, path.join(outDir, 'assets', 'partners'), { recursive: true });
  }
  const heroAssetDir = path.join(projectDir, 'assets', 'hero');
  if (await exists(heroAssetDir)) {
    await fs.cp(heroAssetDir, path.join(outDir, 'assets', 'hero'), { recursive: true });
  }
  const peopleAssetDir = path.join(projectDir, 'assets', 'people');
  if (await exists(peopleAssetDir)) {
    await fs.cp(peopleAssetDir, path.join(outDir, 'assets', 'people'), { recursive: true });
  }
  const blogAssetDir = path.join(projectDir, 'assets', 'blog');
  if (await exists(blogAssetDir)) {
    await fs.cp(blogAssetDir, path.join(outDir, 'assets', 'blog'), { recursive: true });
  }
  const mediaAssetDir = path.join(projectDir, 'assets', 'media');
  if (await exists(mediaAssetDir)) {
    await fs.cp(mediaAssetDir, path.join(outDir, 'assets', 'media'), { recursive: true });
  }
  const faviconAssetDir = path.join(projectDir, 'assets', 'favicon');
  if (await exists(faviconAssetDir)) {
    await fs.cp(faviconAssetDir, path.join(outDir, 'assets', 'favicon'), { recursive: true });
  }

  const imageUrls = new Set();
  const documentUrls = new Set();
  for (const item of data.results) {
    if (item.ogImage) imageUrls.add(item.ogImage);
    for (const img of item.images || []) {
      if (img.src && !img.src.startsWith('data:')) imageUrls.add(img.src);
    }
    for (const link of item.links || []) {
      if (link.href && link.href.includes('/_files/') && link.href.endsWith('.pdf')) documentUrls.add(link.href);
    }
  }

  if (process.env.SKIP_REMOTE_DOWNLOADS === '1') {
    console.log('Skipping remote source downloads for local validation.');
  } else {
    console.log(`Downloading ${imageUrls.size} images and ${documentUrls.size} documents...`);
    await Promise.all([...imageUrls].map((url) => downloadRemote(url, 'media')));
    await Promise.all([...documentUrls].map((url, index) => downloadRemote(url, 'docs', `material-${index + 1}.pdf`)));
  }

  const home = pageByRoute(data, '/');
  logoSrc = `/assets/media/hirayama-horizontal-black.png?v=${assetVersion}`;
  footerLogoSrc = `/assets/media/hirayama-horizontal-transparent.png?v=${assetVersion}`;
  faviconHref = `${customFavicon}?v=${assetVersion}`;
  const rssItems = parseRssItems(data.rssXml || '');
  const rssMap = new Map(rssItems.map((item) => [item.link, item]));
  const sourcePosts = data.results
    .filter((item) => new URL(item.url).pathname.includes('/post/'))
    .map((item, index) => extractPost(item, rssMap, index))
    .sort((a, b) => {
      const da = Date.parse(a.pubDate || '');
      const db = Date.parse(b.pubDate || '');
      if (Number.isFinite(db - da) && db !== da) return db - da;
      return a.index - b.index;
    })
    .map(enhancePost);
  const publishedScheduledPosts = await exists(publishedScheduledPostsPath)
    ? JSON.parse(await fs.readFile(publishedScheduledPostsPath, 'utf8'))
    : [];
  const publishedScheduledAssetsDir = path.join(scheduledContentDir, 'published-assets', 'blog');
  for (const post of publishedScheduledPosts) {
    const sourceImage = path.join(publishedScheduledAssetsDir, post.image || '');
    if (post.image && await exists(sourceImage)) {
      await fs.mkdir(path.join(outDir, 'assets', 'blog', 'scheduled'), { recursive: true });
      await fs.copyFile(sourceImage, path.join(outDir, 'assets', 'blog', 'scheduled', post.image));
    }
  }
  const posts = [
    ...publishedScheduledPosts.map((post) => enhancePost({
      ...post,
      route: `/post/${post.slug}/`,
      author: post.author || 'Ewerton Hirayama',
      image: post.image ? `/assets/blog/scheduled/${post.image}` : '',
      dateLine: post.publishAt ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' }).format(new Date(post.publishAt)) : '',
      pubDate: post.publishAt || ''
    })),
    ...sourcePosts
  ];

  const consortiumPage = { ...pageByPath(data, 'cons'), url: `https://www.hirayamacorretora.com.br${consortiumSiteUrl}` };
  const pages = [
    [home, renderHome(home, posts)],
    [pageByPath(data, 'plano-de-sa'), renderServicePage(pageByPath(data, 'plano-de-sa'), 'PLANO DE SAÚDE')],
    [pageByPath(data, 'seguro-autom'), renderServicePage(pageByPath(data, 'seguro-autom'), 'SEGURO AUTOMÓVEL')],
    [pageByPath(data, 'seguro-de-vida'), renderServicePage(pageByPath(data, 'seguro-de-vida'), 'SEGURO DE VIDA')],
    [consortiumPage, renderConsortiumPage(consortiumPage)],
    [pageByPath(data, 'cote-agora'), renderContact(pageByPath(data, 'cote-agora'))],
    [pageByPath(data, 'downloads'), renderDownloads(pageByPath(data, 'downloads'))],
    [pageByPath(data, 'blog'), renderBlog(pageByPath(data, 'blog'), posts)],
    [{ url: `${originalOrigin}/videos/` }, renderVideos()],
    [pageByPath(data, 'cota-auto'), renderCotaAuto(pageByPath(data, 'cota-auto'))],
    [pageByPath(data, 'politica-de-privacidade'), renderTextPage(pageByPath(data, 'politica-de-privacidade'), 'Política de Privacidade')],
    [pageByPath(data, 'pacotes'), renderTextPage(pageByPath(data, 'pacotes'), 'Pacotes de Seguro')]
  ];

  for (const [item, html] of pages) {
    if (item && html) await writeRoute(routeFromUrl(item.url), html);
  }

  for (const post of posts) {
    await writeRoute(post.route, renderPost(post, posts));
  }
  await writeRoute('/links/', renderLinksPage());

  // The Platinum experience is maintained as its original Vite bundle, served
  // under the Hirayama domain instead of as a separate website.
  const platinumDist = path.join(projectDir, 'consorcio-platinum', 'dist');
  await fs.cp(platinumDist, path.join(outDir, 'consorcio'), {
    recursive: true,
    force: true,
    filter: (source) => path.relative(platinumDist, source) !== 'dist'
  });

  await fs.writeFile(path.join(outDir, 'assets', 'styles.css'), css, 'utf8');
  await fs.writeFile(path.join(outDir, 'assets', 'app.js'), clientJs, 'utf8');
  await fs.writeFile(path.join(outDir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n', 'utf8');
  await fs.writeFile(path.join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['/', ...pages.map(([item]) => item ? routeFromUrl(item.url) : '').filter(Boolean).filter((route) => route !== '/'), ...posts.map((post) => post.route)].map((route) => `  <url><loc>${route}</loc></url>`).join('\n')}\n</urlset>\n`, 'utf8');
  await writeRoute('/404/', renderNotFound());

  console.log(`Generated ${pages.length + posts.length} pages in ${outDir}`);
}

let faviconHref = '';
let logoSrc = '';
let footerLogoSrc = '';

const css = `
:root {
  --blue: #0f6fa8;
  --blue-dark: #174762;
  --orange: #f49b20;
  --ink: #172331;
  --muted: #667386;
  --line: #dce6ee;
  --soft: #f4f8fb;
  --paper: #ffffff;
  --shadow: 0 20px 55px rgba(20, 54, 78, .16);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  color: var(--ink);
  background: var(--paper);
  line-height: 1.6;
}
a { color: inherit; }
img { max-width: 100%; display: block; }
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.skip-link {
  position: fixed;
  top: -100px;
  left: 16px;
  z-index: 20;
  background: var(--blue-dark);
  color: white;
  padding: 10px 14px;
}
.skip-link:focus { top: 16px; }
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  min-height: 86px;
  padding: 14px clamp(20px, 5vw, 70px);
  display: flex;
  align-items: center;
  gap: 30px;
  background: rgba(255,255,255,.96);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(12px);
}
.brand img { width: min(301px, 52vw); height: auto; }
.main-nav {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 30px);
  font-size: 14px;
}
.main-nav a {
  text-decoration: none;
  color: #26384a;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
}
.main-nav a:hover,
.main-nav a[aria-current="page"] { color: var(--blue); border-color: var(--orange); }
.nav-dropdown {
  position: relative;
  padding: 8px 0;
}
.nav-dropdown-trigger {
  border: 0;
  background: transparent;
  color: #26384a;
  font: inherit;
  cursor: pointer;
  padding: 0 18px 0 0;
}
.nav-dropdown-trigger::after {
  content: "";
  position: absolute;
  right: 0;
  top: 18px;
  width: 7px;
  height: 7px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
}
.nav-dropdown.active .nav-dropdown-trigger,
.nav-dropdown:hover .nav-dropdown-trigger,
.nav-dropdown:focus-within .nav-dropdown-trigger {
  color: var(--blue);
}
.dropdown-menu {
  position: absolute;
  top: calc(100% + 16px);
  left: 50%;
  min-width: 245px;
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  box-shadow: var(--shadow);
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, 8px);
  transition: opacity .18s ease, transform .18s ease, visibility .18s ease;
}
.nav-dropdown:hover .dropdown-menu,
.nav-dropdown:focus-within .dropdown-menu,
.nav-dropdown.open .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}
.dropdown-menu a {
  display: block;
  padding: 12px 14px;
  border: 0;
  border-radius: 6px;
}
.dropdown-menu a:hover,
.dropdown-menu a[aria-current="page"] {
  background: var(--soft);
  border: 0;
}
.nav-toggle { display: none; margin-left: auto; }
.hero {
  position: relative;
  min-height: clamp(560px, 72vh, 760px);
  display: grid;
  align-items: center;
  overflow: hidden;
  color: white;
}
.redesigned-hero {
  min-height: clamp(620px, 78vh, 820px);
  align-items: end;
}
.hero-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transition: opacity .8s ease;
}
.redesigned-hero .hero-slide { object-position: 62% center; }
.hero-slide.active { opacity: 1; }
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 37, 55, .18), rgba(15, 37, 55, .78) 72%, rgba(15, 37, 55, .96));
}
.hero-content {
  position: relative;
  width: min(980px, calc(100% - 40px));
  margin: 0 auto;
  padding-bottom: clamp(74px, 10vw, 128px);
}
.eyebrow {
  margin: 0 0 12px;
  color: var(--orange);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0;
}
h1, h2, h3 { line-height: 1.15; letter-spacing: 0; }
h1 { margin: 0 0 20px; font-size: clamp(42px, 7vw, 78px); }
h2 { margin: 0 0 18px; font-size: clamp(28px, 4vw, 46px); }
h3 { margin: 0 0 10px; font-size: 20px; }
.hero p:not(.eyebrow) { font-size: clamp(18px, 2.2vw, 24px); max-width: 720px; }
.hero-micro {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}
.hero-micro span {
  padding: 8px 12px;
  border-left: 3px solid var(--orange);
  background: rgba(255, 255, 255, .12);
  color: white;
  font-weight: 700;
}
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.actions.compact { margin-top: 20px; }
.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 46px;
  padding: 12px 22px;
  border: 0;
  border-radius: 4px;
  background: var(--orange);
  color: #211406;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}
.btn.secondary {
  background: white;
  color: var(--blue-dark);
  border: 1px solid var(--line);
}
.btn.small { min-height: 40px; padding: 9px 16px; font-size: 14px; }
.text-link { color: var(--blue); font-weight: 700; text-decoration: none; border-bottom: 2px solid var(--orange); }
.section {
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(56px, 8vw, 96px) 0;
}
.new-home {
  background: #fff;
}
.home-hero {
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(56px, 8vw, 98px) 0 clamp(34px, 6vw, 70px);
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, .72fr);
  gap: clamp(34px, 6vw, 82px);
  align-items: center;
}
.home-hero h1 {
  max-width: 820px;
  color: var(--blue-dark);
  font-size: clamp(46px, 6.5vw, 82px);
}
.home-hero-copy > p:not(.eyebrow) {
  max-width: 660px;
  margin: 0;
  color: var(--muted);
  font-size: clamp(18px, 2vw, 23px);
}
.home-hero-visual {
  width: 100%;
  max-width: none;
  min-height: clamp(760px, 96vh, 1040px);
  margin: 0;
  padding: clamp(92px, 10vw, 132px) clamp(20px, 7vw, 104px) clamp(82px, 10vw, 128px);
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: start;
  isolation: isolate;
  overflow: hidden;
  color: white;
  background: #0c2638;
}
.home-hero-visual::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(12, 38, 56, .96) 0%, rgba(12, 38, 56, .84) 34%, rgba(12, 38, 56, .42) 58%, rgba(12, 38, 56, .12) 78%, rgba(12, 38, 56, 0) 100%),
    linear-gradient(180deg, rgba(12, 38, 56, .08), rgba(12, 38, 56, .18));
}
.home-hero-visual::after {
  content: "";
  display: none;
  position: absolute;
  inset: auto 0 0;
  height: 44%;
  z-index: 1;
  background: linear-gradient(180deg, transparent, rgba(12, 38, 56, .72));
  pointer-events: none;
}
.hero-bg-rotator {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}
.hero-bg-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.03);
  transition: opacity .9s ease, transform 4.2s ease;
}
.hero-bg-slide.active {
  opacity: 1;
  transform: scale(1);
}
.home-hero-copy {
  position: relative;
  z-index: 2;
}
.home-hero-visual .home-hero-copy {
  width: min(760px, 52vw);
  max-width: none;
  margin: 0;
  display: grid;
  justify-items: start;
  text-align: left;
}
.home-hero-visual .actions {
  justify-content: flex-start;
}
.hero-bg-action-layer {
  position: absolute;
  right: clamp(20px, 7vw, 104px);
  bottom: clamp(28px, 5vw, 70px);
  z-index: 2;
  width: min(360px, calc(100% - 40px));
}
.hero-bg-action {
  position: relative;
  display: none;
  min-height: 76px;
  padding: 15px 56px 15px 18px;
  border-left: 4px solid var(--orange);
  border-radius: 8px;
  background: rgba(255,255,255,.94);
  color: var(--blue-dark);
  text-decoration: none;
  box-shadow: 0 20px 48px rgba(4, 17, 28, .22);
  backdrop-filter: blur(10px);
  transition: transform .18s ease, background .18s ease;
}
.hero-bg-action.active {
  display: grid;
  gap: 4px;
}
.hero-bg-action:hover {
  transform: translateY(-3px);
  background: white;
}
.hero-bg-action span {
  color: #8b5206;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.hero-bg-action strong {
  color: var(--blue-dark);
  font-size: 19px;
  line-height: 1.18;
}
.hero-bg-action::after {
  content: "→";
  position: absolute;
  right: 18px;
  top: 50%;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--orange);
  color: #102e41;
  font-weight: 900;
  transform: translateY(-50%);
}
.home-hero-visual h1 {
  max-width: 900px;
  color: white;
  text-shadow: 0 14px 38px rgba(0,0,0,.28);
}
.home-hero-visual .home-hero-copy > p:not(.eyebrow) {
  max-width: 780px;
  color: rgba(255,255,255,.88);
}
.home-hero-visual .hero-summary-panel {
  align-self: center;
  min-height: auto;
  display: grid;
  align-content: center;
  gap: 0;
  padding: 12px;
  border-color: rgba(255,255,255,.24);
  background: rgba(255,255,255,.16);
  box-shadow: 0 22px 70px rgba(0,0,0,.24);
}
.hero-side-rotator {
  position: relative;
  width: 100%;
  height: min(560px, 68vh);
  aspect-ratio: 4 / 4.85;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,.35);
  box-shadow: 0 18px 38px rgba(0,0,0,.20);
}
.hero-side-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 38%;
  opacity: 0;
  transform: scale(1.015);
  transition: opacity .75s ease, transform 3s ease;
}
.hero-side-slide.active {
  opacity: 1;
  transform: scale(1);
}
.hero-side-action-layer {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 14px;
  z-index: 3;
}
.hero-side-action {
  position: relative;
  display: none;
  width: 100%;
  min-height: 78px;
  align-items: center;
  gap: 4px;
  padding: 15px 56px 15px 18px;
  border-left: 4px solid var(--orange);
  border-radius: 8px;
  background: rgba(255,255,255,.95);
  color: var(--blue-dark);
  text-decoration: none;
  box-shadow: 0 18px 42px rgba(0,0,0,.2);
  transition: transform .18s ease, background .18s ease;
}
.hero-side-action.active {
  display: grid;
}
.hero-side-action:hover {
  transform: translateY(-3px);
  background: white;
}
.hero-side-action span {
  color: #8b5206;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.hero-side-action strong {
  color: var(--blue-dark);
  font-size: 19px;
  line-height: 1.18;
}
.hero-side-action::after {
  content: "→";
  position: absolute;
  right: 18px;
  top: 50%;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--orange);
  color: #102e41;
  font-weight: 900;
  transform: translateY(-50%);
}
.hero-summary-panel .hero-panel-card {
  position: relative;
  z-index: 2;
  left: auto;
  right: auto;
  bottom: auto;
  margin: -58px 16px 0;
}
.hero-panel {
  position: relative;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(244, 155, 32, .14), transparent 34%),
    var(--soft);
}
.hero-panel img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 6px;
}
.hero-panel-card {
  position: absolute;
  left: -24px;
  right: 24px;
  bottom: 38px;
  display: grid;
  gap: 6px;
  padding: 18px;
  border-left: 4px solid var(--orange);
  border-radius: 6px;
  background: white;
  box-shadow: var(--shadow);
}
.hero-panel-card strong { color: var(--blue-dark); }
.hero-panel-card span { color: var(--muted); }
.service-carousel-section {
  width: min(1220px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(44px, 7vw, 82px) 0;
  border-bottom: 1px solid var(--line);
}
.service-carousel-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
  align-items: start;
  margin-bottom: 26px;
}
.service-carousel-head h2 {
  max-width: 760px;
}
.service-carousel-head p:not(.eyebrow) {
  max-width: 760px;
  color: var(--muted);
  font-size: 18px;
}
.service-carousel-stage {
  position: relative;
}
.service-carousel-side {
  position: absolute;
  top: 50%;
  z-index: 5;
  width: 58px;
  height: 58px;
  border: 1px solid #cadbe4;
  border-radius: 50%;
  background: rgba(255,255,255,.96);
  color: var(--blue-dark);
  font-size: 38px;
  line-height: 1;
  box-shadow: 0 18px 40px rgba(11, 37, 55, .18);
  cursor: pointer;
  transform: translateY(-50%);
  transition: transform .18s ease, border-color .18s ease, background .18s ease, color .18s ease;
}
.service-carousel-side:hover {
  transform: translateY(-50%) scale(1.05);
  border-color: var(--orange);
  background: var(--orange);
  color: #211406;
}
.service-carousel-side-prev {
  left: -26px;
}
.service-carousel-side-next {
  right: -26px;
}
.service-carousel-viewport {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  cursor: grab;
}
.service-carousel-viewport::-webkit-scrollbar {
  display: none;
}
.service-carousel-viewport.is-dragging {
  cursor: grabbing;
  scroll-behavior: auto;
}
.service-carousel-track {
  display: flex;
  gap: 18px;
}
.service-showcase-slide {
  min-height: 520px;
  min-width: 0;
  flex: 0 0 100%;
  display: grid;
  grid-template-columns: minmax(0, .92fr) minmax(360px, 1.08fr);
  gap: clamp(24px, 5vw, 58px);
  align-items: center;
  overflow: hidden;
  padding: clamp(32px, 5vw, 58px) clamp(88px, 8vw, 112px);
  border-radius: 8px;
  scroll-snap-align: start;
  color: white;
  background:
    radial-gradient(circle at 18% 16%, rgba(244, 155, 32, .24), transparent 30%),
    linear-gradient(135deg, #0b2537, #102e41 62%, #183f58);
}
.service-showcase-auto {
  background:
    radial-gradient(circle at 18% 16%, rgba(244, 155, 32, .22), transparent 30%),
    linear-gradient(135deg, #0b2537, #153f5a 68%, #eff6f9 68%);
}
.service-showcase-platinum {
  background:
    radial-gradient(circle at 16% 14%, rgba(244, 155, 32, .26), transparent 30%),
    linear-gradient(135deg, #102e41, #0b2537 58%, #174b63 100%);
}
.service-showcase-health {
  background:
    radial-gradient(circle at 18% 18%, rgba(42, 153, 172, .24), transparent 30%),
    linear-gradient(135deg, #0c3341, #174d5f 62%, #12364a 100%);
}
.service-showcase-credit {
  background:
    radial-gradient(circle at 18% 18%, rgba(244, 155, 32, .23), transparent 30%),
    linear-gradient(135deg, #132c4a, #183a62 62%, #102e41 100%);
}
.service-showcase-benefits {
  background:
    radial-gradient(circle at 18% 18%, rgba(245, 188, 64, .22), transparent 30%),
    linear-gradient(135deg, #1c3441, #245062 62%, #12364a 100%);
}
.service-showcase-copy {
  position: relative;
  min-width: 0;
}
.service-showcase-name {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  margin-bottom: 22px;
  padding: 7px 14px 7px 7px;
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 999px;
  background: rgba(255,255,255,.1);
  color: white;
  backdrop-filter: blur(12px);
}
.service-showcase-count {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255,255,255,.28);
  border-radius: 50%;
  background: #0b2537;
  color: white;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 0 0 4px rgba(244, 155, 32, .16);
}
.service-showcase-name strong {
  color: rgba(255,255,255,.92);
  font-size: 14px;
  line-height: 1.2;
}
.service-showcase-copy .eyebrow {
  color: var(--orange);
}
.service-showcase-copy h3 {
  max-width: 700px;
  color: white;
  font-size: clamp(34px, 4.8vw, 62px);
  line-height: .98;
  overflow-wrap: anywhere;
}
.service-showcase-copy p:not(.eyebrow) {
  max-width: 680px;
  color: rgba(255,255,255,.84);
  font-size: 18px;
}
.service-showcase-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}
.service-showcase-actions .secondary {
  border-color: rgba(255,255,255,.44);
  background: rgba(255,255,255,.1);
  color: white;
}
.service-showcase-panel {
  min-width: 0;
  padding: clamp(22px, 4vw, 34px);
  border: 1px solid rgba(13, 47, 70, .12);
  border-radius: 8px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 24px 70px rgba(11, 37, 55, .2);
}
.guide-label {
  margin: 0 0 14px;
  color: var(--orange);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.service-showcase-panel ol {
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: showcase-guide;
}
.service-showcase-panel li {
  counter-increment: showcase-guide;
  display: grid;
  grid-template-columns: 50px minmax(132px, .36fr) minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  padding: 16px 0;
  border-top: 1px solid #dbe7ee;
}
.service-showcase-panel li:first-child {
  border-top: 0;
}
.service-showcase-panel li::before {
  content: counter(showcase-guide, decimal-leading-zero);
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #0b2537;
  color: white;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 0 0 4px rgba(15, 111, 168, .12);
}
.service-showcase-panel strong {
  color: var(--blue-dark);
  font-size: 17px;
  line-height: 1.25;
}
.service-showcase-panel span {
  color: var(--muted);
  line-height: 1.55;
  overflow-wrap: anywhere;
}
.service-showcase-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.service-showcase-badges span {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 7px 10px;
  border: 1px solid #d7e3ea;
  border-radius: 999px;
  background: #f7fbfd;
  color: var(--blue-dark);
  font-size: 13px;
  font-weight: 800;
}
.service-carousel-dots {
  display: flex;
  justify-content: center;
  gap: 9px;
  margin-top: 18px;
}
.service-carousel-dots button {
  width: 9px;
  height: 9px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #c5d7e0;
  cursor: pointer;
  transition: width .18s ease, background .18s ease;
}
.service-carousel-dots button.active {
  width: 28px;
  border-radius: 999px;
  background: var(--orange);
}
.section-heading {
  max-width: 760px;
  margin-bottom: 34px;
}
.section-heading p:not(.eyebrow) {
  margin: 0;
  color: var(--muted);
  font-size: 18px;
}
.service-overview {
  padding-top: clamp(64px, 8vw, 104px);
}
.service-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  counter-reset: service-card;
  border-top: 1px solid #d3e2ea;
  border-bottom: 1px solid #d3e2ea;
}
.service-tile {
  counter-increment: service-card;
  min-height: auto;
  display: grid;
  grid-template-columns: 72px minmax(170px, .42fr) minmax(0, 1fr) auto;
  gap: 22px;
  align-items: center;
  position: relative;
  overflow: visible;
  padding: 24px 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  outline: 0;
  transition: transform .18s ease, background .18s ease;
}
.service-tile::before {
  content: counter(service-card, decimal-leading-zero);
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(244, 155, 32, .34);
  border-radius: 50%;
  background: #fff6e8;
  color: var(--orange);
  font-weight: 800;
}
.service-tile::after {
  content: "";
  position: absolute;
  left: 94px;
  right: 0;
  bottom: 0;
  height: 1px;
  background: #dbe7ee;
}
.service-tile:hover {
  transform: translateX(6px);
  background: linear-gradient(90deg, rgba(244, 155, 32, .08), transparent 56%);
}
.service-tile span {
  width: fit-content;
  padding: 5px 9px;
  border-radius: 999px;
  background: #fff4e4;
  color: #8b5206;
  font-size: 12px;
  font-weight: 700;
}
.service-tile h3 {
  margin: 6px 0 0;
  color: var(--blue-dark);
}
.service-tile p {
  margin: 0;
  color: var(--muted);
}
.service-tile a {
  white-space: nowrap;
  color: var(--blue);
  font-weight: 700;
  text-decoration: none;
}
.service-tile a::after {
  content: " ->";
  color: var(--orange);
}
.info-layout {
  display: grid;
  grid-template-columns: .72fr 1fr;
  gap: clamp(28px, 5vw, 70px);
  align-items: start;
  border-top: 0;
}
.info-layout > div > p:not(.eyebrow) {
  color: var(--muted);
  font-size: 18px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border-left: 1px solid #d3e2ea;
}
.info-grid article,
.process-grid article,
.latest-grid article,
.ewerton-card {
  position: relative;
  overflow: hidden;
  border: 1px solid #d3e2ea;
  border-radius: 8px;
  background: white;
  box-shadow: 0 12px 30px rgba(12, 38, 56, .06);
  transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
}
.info-grid article::before,
.process-grid article::before,
.latest-grid article::before,
.ewerton-card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 4px;
  background: linear-gradient(90deg, var(--orange), #0f6fa8);
}
.info-grid article:hover,
.process-grid article:hover,
.latest-grid article:hover,
.ewerton-card:hover {
  transform: translateY(-6px);
  border-color: rgba(244, 155, 32, .62);
  box-shadow: 0 24px 54px rgba(12, 38, 56, .14);
}
.info-grid article {
  padding: 0 0 22px 26px;
  border: 0;
  border-bottom: 1px solid #dbe7ee;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
.info-grid article:last-child {
  border-bottom: 0;
}
.info-grid article::before {
  inset: 7px auto auto -6px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--orange);
  box-shadow: 0 0 0 7px rgba(244, 155, 32, .14);
}
.info-grid article:hover {
  transform: translateX(6px);
  border-color: #dbe7ee;
  box-shadow: none;
}
.info-grid h3 {
  display: block;
  color: var(--blue-dark);
}
.info-grid p,
.process-grid p { color: var(--muted); }
.consortium-focus-section {
  width: 100%;
  max-width: none;
  padding: clamp(62px, 8vw, 106px) 0;
  overflow: hidden;
  background:
    linear-gradient(90deg, rgba(244,155,32,.16) 0 1px, transparent 1px 100%) 0 0 / 72px 72px,
    radial-gradient(circle at 18% 20%, rgba(244, 155, 32, .24), transparent 28%),
    linear-gradient(135deg, #071d2d, #102e41 64%, #173d53);
  color: white;
}
.consortium-focus-shell {
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, .86fr) minmax(360px, 1.14fr);
  gap: clamp(28px, 6vw, 76px);
  align-items: center;
}
.consortium-focus-copy .eyebrow {
  color: var(--orange);
}
.consortium-focus-copy h2 {
  max-width: 650px;
  color: white;
  font-size: clamp(36px, 5vw, 64px);
  line-height: .98;
}
.consortium-focus-copy p:not(.eyebrow) {
  max-width: 620px;
  color: rgba(255,255,255,.82);
  font-size: 18px;
}
.consortium-focus-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}
.consortium-focus-actions .secondary {
  border-color: rgba(255,255,255,.38);
  background: rgba(255,255,255,.08);
  color: white;
}
.consortium-focus-map {
  position: relative;
  display: grid;
  gap: 0;
  padding-left: 28px;
}
.consortium-focus-map::before {
  content: "";
  position: absolute;
  left: 0;
  top: 18px;
  bottom: 18px;
  width: 3px;
  border-radius: 999px;
  background: linear-gradient(var(--orange), rgba(255,255,255,.2));
}
.consortium-focus-map article {
  position: relative;
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: 18px;
  padding: 26px 0;
  border-top: 1px solid rgba(255,255,255,.16);
}
.consortium-focus-map article:first-child {
  border-top: 0;
}
.consortium-focus-map article::before {
  content: "";
  position: absolute;
  left: -34px;
  top: 42px;
  width: 15px;
  height: 15px;
  border: 3px solid #102e41;
  border-radius: 50%;
  background: var(--orange);
}
.consortium-focus-map span {
  color: rgba(244,155,32,.96);
  font-size: clamp(38px, 5vw, 64px);
  font-weight: 900;
  line-height: .9;
}
.consortium-focus-map small {
  display: block;
  margin-bottom: 6px;
  color: var(--orange);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.consortium-focus-map h3 {
  margin: 0 0 8px;
  color: white;
  font-size: clamp(24px, 3vw, 34px);
}
.consortium-focus-map p {
  max-width: 560px;
  margin: 0;
  color: rgba(255,255,255,.76);
  font-size: 16px;
  line-height: 1.58;
}
.ewerton-section {
  width: 100%;
  max-width: none;
  padding: clamp(64px, 8vw, 108px) clamp(20px, 7vw, 104px);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background:
    linear-gradient(135deg, rgba(244, 155, 32, .11), transparent 32%),
    #f7fafb;
}
.ewerton-profile {
  width: min(1160px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(260px, .55fr) minmax(0, 1fr);
  gap: clamp(28px, 6vw, 74px);
  align-items: center;
}
.ewerton-photo-wrap {
  position: relative;
  padding: 14px;
  border: 1px solid #d6e3eb;
  border-radius: 8px;
  background: white;
  box-shadow: 0 24px 60px rgba(12, 38, 56, .12);
}
.ewerton-photo-wrap::after {
  content: "";
  position: absolute;
  right: -14px;
  bottom: -14px;
  width: 42%;
  height: 42%;
  z-index: -1;
  border: 2px solid var(--orange);
  border-radius: 8px;
}
.ewerton-photo-wrap img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 6px;
  display: block;
}
.ewerton-copy h2 {
  max-width: 720px;
}
.ewerton-copy p:not(.eyebrow) {
  max-width: 780px;
  color: var(--muted);
  font-size: 18px;
}
.ewerton-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}
.ewerton-card-grid {
  width: min(1160px, 100%);
  margin: 34px auto 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.ewerton-card {
  position: relative;
  overflow: hidden;
  min-height: 220px;
  padding: 30px 24px 24px;
}
.ewerton-card h3 {
  color: var(--blue-dark);
}
.ewerton-card p {
  color: var(--muted);
}
.process-section {
  width: 100%;
  max-width: none;
  padding: clamp(64px, 8vw, 104px) clamp(20px, 7vw, 104px);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: #f7fafb;
}
.process-section .section-heading,
.process-grid {
  width: min(1160px, 100%);
  margin-left: auto;
  margin-right: auto;
}
.process-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  position: relative;
  margin-top: 44px;
  border-top: 2px solid #d3e2ea;
}
.process-grid article {
  padding: 28px 24px 0 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  overflow: visible;
}
.process-grid article::before {
  inset: -9px auto auto 0;
  width: 16px;
  height: 16px;
  border: 3px solid #f7fafb;
  border-radius: 50%;
  background: var(--orange);
  box-shadow: 0 0 0 1px rgba(244, 155, 32, .35);
}
.process-grid article:hover {
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow: none;
}
.process-grid span {
  display: block;
  margin-bottom: 16px;
  border: 0;
  background: transparent;
  color: var(--orange);
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}
.ecosystem-section {
  display: grid;
  grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
  gap: clamp(30px, 6vw, 78px);
  align-items: start;
  border-top: 1px solid var(--line);
}
.ecosystem-heading {
  position: sticky;
  top: 118px;
}
.ecosystem-heading p:not(.eyebrow) {
  color: var(--muted);
  font-size: 18px;
}
.ecosystem-lanes {
  border-top: 1px solid #cfdfe8;
}
.ecosystem-lanes a {
  min-height: 112px;
  display: grid;
  grid-template-columns: 54px minmax(130px, .34fr) minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px solid #dbe7ee;
  color: inherit;
  text-decoration: none;
}
.ecosystem-lanes a:hover {
  background: linear-gradient(90deg, rgba(244, 155, 32, .08), transparent);
}
.ecosystem-lanes span {
  color: var(--orange);
  font-weight: 900;
}
.ecosystem-lanes strong {
  color: var(--blue-dark);
  font-size: 20px;
}
.ecosystem-lanes small {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.55;
}
.platinum-auto-section {
  width: 100%;
  max-width: none;
  padding: clamp(54px, 8vw, 94px) 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 10% 15%, rgba(244, 155, 32, .22), transparent 30%),
    linear-gradient(135deg, #0b2537 0%, #102e41 58%, #f4f8fb 58%, #eef5f8 100%);
}
.platinum-auto-inner {
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, .88fr) minmax(320px, 1.08fr) minmax(260px, .86fr);
  gap: clamp(24px, 4vw, 44px);
  align-items: center;
}
.platinum-auto-copy {
  color: white;
}
.platinum-auto-copy .eyebrow {
  color: var(--orange);
}
.platinum-auto-copy h2 {
  color: white;
  font-size: clamp(36px, 5vw, 62px);
}
.platinum-auto-copy p:not(.eyebrow) {
  color: rgba(255, 255, 255, .84);
  font-size: 18px;
}
.platinum-auto-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}
.platinum-auto-actions .secondary {
  border-color: rgba(255,255,255,.42);
  color: white;
}
.platinum-auto-road {
  position: relative;
  padding: 10px 0;
  color: white;
}
.platinum-auto-road::before {
  content: "";
  position: absolute;
  top: 18px;
  bottom: 18px;
  left: 25px;
  width: 2px;
  background: linear-gradient(var(--orange), rgba(255,255,255,.18));
}
.platinum-auto-road article {
  position: relative;
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 16px;
  padding: 0 0 26px;
}
.platinum-auto-road article:last-child {
  padding-bottom: 0;
}
.platinum-auto-road span {
  z-index: 1;
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 50%;
  background: #f49b20;
  color: #102e41;
  font-weight: 900;
}
.platinum-auto-road h3 {
  margin: 0 0 6px;
  color: white;
  font-size: 20px;
}
.platinum-auto-road p {
  margin: 0;
  color: rgba(255,255,255,.76);
}
.platinum-auto-partners {
  padding: clamp(22px, 4vw, 32px);
  border: 1px solid rgba(13, 47, 70, .12);
  border-radius: 8px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 24px 70px rgba(11, 37, 55, .18);
}
.platinum-partners-label {
  margin: 0 0 18px;
  color: var(--orange);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.platinum-partner-row {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  padding: 18px 0;
  border-top: 1px solid #dbe7ee;
}
.platinum-partner-row:first-of-type {
  border-top: 0;
  padding-top: 0;
}
.platinum-partner-row:last-child {
  padding-bottom: 0;
}
.platinum-partner-mark {
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border: 1px solid #d7e3ea;
  border-radius: 8px;
  background: #f8fbfd;
}
.platinum-partner-mark img {
  width: 62px;
  max-height: 44px;
  object-fit: contain;
}
.platinum-partner-mark strong {
  color: #d7382a;
  font-size: 13px;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
}
.platinum-partner-row strong {
  color: var(--blue-dark);
  font-size: 18px;
}
.platinum-partner-row p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.45;
}
.business-section {
  display: grid;
  grid-template-columns: .9fr 1fr;
  gap: clamp(24px, 5vw, 70px);
  align-items: center;
  padding: clamp(42px, 6vw, 74px);
  border-radius: 8px;
  background: #102e41;
  color: white;
}
.business-section .eyebrow,
.business-section .text-link { color: var(--orange); }
.business-section p { color: rgba(255,255,255,.82); font-size: 18px; }
.latest-section {
  border-top: 1px solid var(--line);
}
.latest-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.latest-grid .post-card::before {
  display: none;
}
.latest-grid .post-card {
  padding: 0;
}
.partners-marquee-section {
  width: 100%;
  max-width: none;
  padding: clamp(48px, 7vw, 78px) 0;
  overflow: hidden;
  background: #102e41;
  color: white;
}
.partners-marquee-head {
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto 28px;
  display: grid;
  grid-template-columns: .85fr 1fr;
  gap: clamp(22px, 5vw, 64px);
  align-items: end;
}
.partners-marquee-head h2 {
  color: white;
}
.partners-marquee-head p:not(.eyebrow) {
  margin: 0;
  color: rgba(255,255,255,.78);
  font-size: 18px;
}
.partner-marquee {
  position: relative;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.partner-track {
  width: max-content;
  display: flex;
  gap: 14px;
  animation: partnerMarquee 30s linear infinite;
}
.partner-marquee:hover .partner-track {
  animation-play-state: paused;
}
.partner-pill {
  width: 286px;
  min-height: 94px;
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 14px;
  align-items: center;
  padding: 11px 15px;
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 8px;
  background: rgba(255,255,255,.09);
  color: white;
  text-decoration: none;
  backdrop-filter: blur(6px);
  transition: transform .18s ease, background .18s ease, border-color .18s ease;
}
.partner-pill:hover {
  transform: translateY(-3px);
  border-color: rgba(244, 155, 32, .7);
  background: rgba(255,255,255,.15);
}
.partner-mark {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 6px;
  background: white;
}
.partner-mark img {
  max-width: 60px;
  max-height: 56px;
  object-fit: contain;
}
.partner-mark img[src*="rodobens-consorcio"],
.partner-mark img[src*="porto-consorcio"] {
  width: 66px;
  height: 66px;
  max-width: none;
  max-height: none;
  object-fit: contain;
  object-position: center;
}
.partner-text {
  display: grid;
  gap: 3px;
  min-width: 0;
}
.partner-text strong {
  overflow: hidden;
  color: white;
  font-size: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.partner-text small {
  overflow: hidden;
  color: rgba(255,255,255,.68);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@keyframes partnerMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-50% - 7px)); }
}
.links-page {
  min-height: 100vh;
  margin: 0;
  color: white;
  background:
    radial-gradient(circle at 50% 14%, rgba(15, 111, 168, .24), transparent 32%),
    linear-gradient(135deg, #06101d, #071a2b 58%, #04111f);
}
.links-stage {
  min-height: 100vh;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 36px 20px;
}
.links-card {
  width: min(100%, 344px);
  display: grid;
  justify-items: center;
  padding: 30px 18px 26px;
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 24px;
  background: rgba(13, 28, 45, .86);
  box-shadow: 0 30px 80px rgba(0,0,0,.36);
  text-align: center;
}
.links-avatar {
  width: 84px;
  height: 84px;
  object-fit: cover;
  border: 3px solid rgba(244, 155, 32, .9);
  border-radius: 50%;
  box-shadow: 0 10px 26px rgba(0,0,0,.28);
}
.links-kicker {
  margin: 18px 0 4px;
  color: white;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: .02em;
}
.links-card h1 {
  max-width: 245px;
  margin: 0 0 18px;
  color: rgba(255,255,255,.9);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.55;
}
.links-list {
  width: 100%;
  display: grid;
  gap: 10px;
}
.bio-link {
  min-height: 48px;
  display: grid;
  grid-template-columns: 36px 1fr 18px;
  gap: 12px;
  align-items: center;
  padding: 6px 15px 6px 7px;
  border-radius: 999px;
  background: #fff;
  color: #03101e;
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;
  transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
}
.bio-link:hover {
  transform: translateY(-2px);
  background: #ffc83d;
  box-shadow: 0 12px 24px rgba(0,0,0,.2);
}
.bio-link.primary {
  background: #fff;
}
.bio-link-code {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #061426;
  color: white;
  font-size: 10px;
  font-weight: 900;
}
.links-socials {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 18px 0 14px;
}
.social-button {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: transform .18s ease, box-shadow .18s ease;
}
.social-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px rgba(0,0,0,.28);
}
.social-button svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
}
.social-linkedin { background: #0a66c2; }
.social-instagram {
  background:
    radial-gradient(circle at 30% 105%, #feda75 0 18%, transparent 36%),
    linear-gradient(135deg, #833ab4, #fd1d1d 55%, #fcb045);
}
.social-whatsapp { background: #25d366; }
.social-youtube { background: #ff0000; }
.social-tiktok { background: #000; }
.social-facebook { background: #1877f2; }
.floating-socials {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  pointer-events: none;
}
.floating-social-button {
  position: relative;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  text-decoration: none;
  box-shadow: 0 10px 18px rgba(15, 35, 52, .18);
  transition: transform .3s ease, box-shadow .3s ease, filter .3s ease, background-color .3s ease;
  pointer-events: auto;
}
.floating-social-button:hover,
.floating-social-button:focus-visible {
  transform: scale(1.05);
  outline: none;
}
.floating-social-button svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
.floating-linkedin {
  background: #0a66c2;
}
.floating-linkedin:hover,
.floating-linkedin:focus-visible {
  background: #0958a8;
  box-shadow: 0 12px 24px rgba(10, 102, 194, .45);
}
.floating-youtube {
  background: #ff0000;
  box-shadow: 0 10px 18px rgba(255, 0, 0, .28);
}
.floating-youtube:hover,
.floating-youtube:focus-visible {
  background: #d90000;
  box-shadow: 0 12px 24px rgba(255, 0, 0, .42);
}
.floating-instagram {
  background:
    radial-gradient(circle at 30% 105%, #feda75 0 18%, transparent 36%),
    linear-gradient(135deg, #f58529, #dd2a7b 48%, #8134af);
}
.floating-instagram:hover,
.floating-instagram:focus-visible {
  filter: brightness(1.1);
  box-shadow: 0 12px 24px rgba(221, 42, 123, .45);
}
.floating-whatsapp {
  background: #25d366;
}
.floating-whatsapp:hover,
.floating-whatsapp:focus-visible {
  background: #20ba5a;
  box-shadow: 0 12px 24px rgba(37, 211, 102, .45);
}
.floating-tooltip {
  position: absolute;
  right: calc(100% + 10px);
  top: 50%;
  transform: translate(8px, -50%);
  padding: 7px 10px;
  border-radius: 6px;
  background: #061426;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  box-shadow: 0 10px 24px rgba(6, 20, 38, .22);
  transition: opacity .18s ease, transform .18s ease, visibility .18s ease;
  pointer-events: none;
}
.floating-social-button:hover .floating-tooltip,
.floating-social-button:focus-visible .floating-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translate(0, -50%);
}
.links-site {
  color: rgba(255,255,255,.72);
  font-size: 11px;
  text-decoration: none;
}
.links-site:hover {
  color: white;
}
.quick-dock {
  width: min(1160px, calc(100% - 40px));
  margin: -54px auto 0;
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
  background: white;
}
.quick-dock a {
  min-height: 118px;
  padding: 20px;
  display: grid;
  align-content: center;
  gap: 8px;
  text-decoration: none;
  border-right: 1px solid var(--line);
}
.quick-dock a:last-child { border-right: 0; }
.quick-dock strong { color: var(--blue-dark); font-size: 15px; }
.quick-dock span { color: var(--muted); font-size: 14px; }
.quick-dock a:hover { background: var(--soft); }
.centered { text-align: center; }
.centered > h2 { max-width: 760px; margin-left: auto; margin-right: auto; }
.product-grid,
.blog-grid,
.download-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  margin-top: 34px;
}
.product-card,
.post-card,
.download-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(29, 72, 99, .08);
}
.product-card { padding: 26px; min-height: 210px; text-align: left; }
.product-card {
  border-top: 4px solid var(--orange);
}
.product-card h3 { color: var(--blue-dark); }
.product-card a { color: var(--blue); font-weight: 700; text-decoration: none; }
.blog-library {
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(58px, 8vw, 98px) 0;
}
.blog-library-head {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, .85fr);
  gap: clamp(24px, 5vw, 70px);
  align-items: end;
  margin-bottom: 26px;
}
.blog-library-head h1 {
  margin: 0;
  color: var(--blue-dark);
  font-size: clamp(42px, 6vw, 72px);
  line-height: .98;
}
.blog-library-head p:not(.eyebrow) {
  margin: 0;
  color: var(--muted);
  font-size: 18px;
  line-height: 1.75;
}
.blog-grid.article-grid {
  margin-top: 30px;
  gap: 20px;
}
.videos-hero {
  width: min(1160px, calc(100% - 40px));
  min-height: 330px;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(260px, .65fr);
  align-items: end;
  gap: clamp(24px, 7vw, 100px);
  margin: 0 auto;
  padding: clamp(72px, 10vw, 132px) clamp(24px, 6vw, 76px) clamp(36px, 6vw, 62px);
  background: linear-gradient(122deg, #103f3b 0%, #165e58 58%, #3ccbb6 155%);
}
.videos-hero h1 {
  max-width: 740px;
  margin: 0;
  color: white;
  font-size: clamp(42px, 6vw, 76px);
  line-height: .98;
}
.videos-hero .eyebrow { color: #f2bf61; }
.videos-hero > p {
  margin: 0 0 8px;
  color: rgba(255, 255, 255, .84);
  font-size: 18px;
  line-height: 1.72;
}
.video-library {
  width: min(1040px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(48px, 8vw, 96px) 0 clamp(70px, 10vw, 120px);
}
.video-item {
  display: grid;
  grid-template-columns: minmax(220px, .55fr) minmax(0, 1fr);
  gap: clamp(30px, 6vw, 90px);
  align-items: center;
  padding: clamp(28px, 5vw, 54px) 0;
  border-bottom: 1px solid var(--line);
}
.video-item:first-child { padding-top: 0; }
.video-frame {
  width: min(100%, 280px);
  justify-self: center;
  overflow: hidden;
  border: 1px solid #cde0de;
  border-radius: 8px;
  background: #0d302d;
  box-shadow: 0 22px 46px rgba(16, 63, 59, .18);
}
.video-player {
  display: block;
  width: 100%;
  aspect-ratio: 9 / 16;
  border: 0;
}
.video-copy { position: relative; padding-right: 60px; }
.video-copy h2 {
  max-width: 560px;
  margin: 8px 0 14px;
  color: var(--blue-dark);
  font-size: clamp(27px, 3vw, 42px);
  line-height: 1.05;
}
.video-copy > p:not(.cat) {
  max-width: 560px;
  margin: 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.7;
}
.video-watch {
  display: inline-flex;
  gap: 10px;
  margin-top: 22px;
  color: var(--blue-dark);
  font-weight: 900;
  text-decoration: none;
  border-bottom: 2px solid var(--orange);
}
.video-watch:hover { color: #00777b; }
.video-index {
  position: absolute;
  top: 0;
  right: 0;
  color: #c6dce2;
  font-size: 36px;
  font-weight: 900;
}
.home-video-section {
  padding: clamp(58px, 9vw, 104px) max(20px, calc((100% - 1160px) / 2));
  background: #103f3b;
}
.home-video-head {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(260px, .65fr);
  gap: clamp(26px, 7vw, 100px);
  align-items: end;
  max-width: 1160px;
  margin: 0 auto 36px;
}
.home-video-head .eyebrow { color: #f2bf61; }
.home-video-head h2 {
  max-width: 650px;
  margin: 0;
  color: white;
  font-size: clamp(34px, 4.8vw, 62px);
  line-height: 1.02;
}
.home-video-head > div:last-child > p {
  margin: 0 0 16px;
  color: rgba(255, 255, 255, .78);
  line-height: 1.7;
}
.home-video-head .text-link { color: white; }
.home-video-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(24px, 5vw, 70px);
  max-width: 1000px;
  margin: 0 auto;
}
.home-video-item {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 22px;
  align-items: center;
  min-width: 0;
}
.home-video-frame {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .28);
  border-radius: 8px;
  background: #082522;
  box-shadow: 0 16px 34px rgba(0, 0, 0, .2);
}
.home-video-player {
  display: block;
  width: 100%;
  aspect-ratio: 9 / 16;
  border: 0;
}
.home-video-copy { position: relative; padding-top: 20px; }
.home-video-copy > span {
  position: absolute;
  top: 0;
  color: rgba(244, 239, 228, .4);
  font-size: 14px;
  font-weight: 900;
}
.home-video-copy .cat { color: #f2bf61; }
.home-video-copy h3 {
  margin: 8px 0 14px;
  color: white;
  font-size: clamp(21px, 2.2vw, 30px);
  line-height: 1.1;
}
.home-video-copy a {
  color: white;
  font-size: 14px;
  font-weight: 900;
  text-decoration: none;
  border-bottom: 2px solid var(--orange);
}
.home-video-copy a:hover { color: #f2bf61; }
.post-card {
  min-height: 390px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: white;
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 14px 38px rgba(29, 72, 99, .09);
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}
.post-card:hover {
  transform: translateY(-5px);
  border-color: rgba(15, 111, 168, .28);
  box-shadow: 0 24px 58px rgba(12, 38, 56, .14);
}
.post-card-image {
  display: block;
  overflow: hidden;
  background: #edf5f9;
}
.post-card img {
  width: 100%;
  aspect-ratio: 1.7 / 1;
  object-fit: cover;
  transition: transform .32s ease, filter .32s ease;
}
.post-card:hover img {
  transform: scale(1.04);
  filter: saturate(1.04) contrast(1.02);
}
.post-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 22px;
}
.cat {
  margin: 0 0 10px;
  color: #bd7c18;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .05em;
  text-transform: uppercase;
}
.post-card h2,
.post-card h3 {
  margin: 0 0 13px;
  color: var(--blue-dark);
  font-size: 20px;
  line-height: 1.28;
}
.post-card h2 a,
.post-card h3 a {
  color: inherit;
  text-decoration: none;
}
.post-card-body > p:not(.cat) {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.65;
}
.post-card footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(210, 226, 234, .9);
  color: var(--muted);
  font-size: 13px;
}
.post-card footer strong {
  color: #00777b;
}
.article-shell {
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 2fr) 360px;
  gap: 28px;
  align-items: start;
  padding: clamp(42px, 7vw, 78px) 0 clamp(60px, 8vw, 100px);
}
.article-main,
.side-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 18px 48px rgba(29, 72, 99, .1);
}
.article-cover {
  width: 100%;
  aspect-ratio: 1.62 / 1;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
  background: #edf5f9;
}
.article-head {
  padding: clamp(26px, 5vw, 48px);
  border-bottom: 1px solid var(--line);
}
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0 0 20px;
}
.pill {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 11px;
  border: 1px solid #d8e7ee;
  border-radius: 7px;
  color: #416077;
  background: #f5fafc;
  font-size: 12px;
  font-weight: 800;
}
.article-head h1 {
  margin: 0;
  color: var(--blue-dark);
  font-size: clamp(34px, 5vw, 58px);
  line-height: 1.02;
}
.article-head > p {
  max-width: 760px;
  margin: 20px 0 0;
  color: var(--muted);
  font-size: 18px;
  line-height: 1.72;
}
.author-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}
.author {
  display: flex;
  align-items: center;
  gap: 12px;
}
.author-photo {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 8px 18px rgba(29, 72, 99, .18);
}
.author strong,
.author span {
  display: block;
}
.author strong { color: var(--blue-dark); }
.author span { color: var(--muted); font-size: 13px; }
.share-button {
  color: var(--blue-dark);
  background: white;
  border-color: var(--blue-dark);
}
.share-button[data-state="success"] {
  background: #0f6b5f;
  color: white;
  border-color: #0f6b5f;
}
.share-button[data-state="error"] {
  background: #9f2f2f;
  color: white;
  border-color: #9f2f2f;
}
.article-main .article-body {
  display: grid;
  gap: clamp(24px, 4vw, 38px);
  max-width: none;
  padding: clamp(28px, 5vw, 54px);
  font-size: 17px;
}
.article-main .article-body h2 {
  margin: 0 0 14px;
  color: var(--blue-dark);
  font-size: clamp(24px, 3vw, 32px);
  line-height: 1.2;
}
.article-main .article-body p {
  margin: 0 0 18px;
  color: #2f4a60;
  line-height: 1.86;
}
.article-main .article-body .bullet {
  margin-bottom: 10px;
}
.article-kicker {
  margin: 0 0 10px !important;
  color: #00777b !important;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.article-brief {
  padding: clamp(24px, 4vw, 34px);
  border: 1px solid #d4e8ee;
  border-left: 5px solid var(--orange);
  border-radius: 8px;
  background: #f3fafc;
}
.article-brief h2 {
  font-size: clamp(26px, 3vw, 36px) !important;
}
.article-brief p:last-child,
.article-section p:last-child,
.article-note p,
.article-closing p {
  margin-bottom: 0;
}
.article-scan-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.article-scan-grid article {
  min-height: 190px;
  padding: 20px;
  border: 1px solid #d9e9ef;
  border-radius: 8px;
  background: linear-gradient(180deg, #ffffff, #f7fbfd);
}
.article-scan-grid span {
  display: block;
  margin-bottom: 12px;
  color: var(--orange);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}
.article-scan-grid p {
  margin: 0 !important;
  color: #27445a !important;
  font-size: 15px;
  line-height: 1.65 !important;
}
.article-section {
  padding-top: 4px;
}
.article-section + .article-section {
  padding-top: clamp(26px, 4vw, 42px);
  border-top: 1px solid rgba(210, 226, 234, .9);
}
.article-check-panel {
  margin: 24px 0 2px;
  padding: clamp(20px, 4vw, 28px);
  border: 1px solid #d8e9ef;
  border-radius: 8px;
  background: #fbfdfe;
}
.article-check-panel > p {
  margin-bottom: 14px;
  color: var(--blue-dark);
  font-weight: 800;
}
.article-checklist,
.article-question-panel ul {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.article-checklist li,
.article-question-panel li {
  position: relative;
  padding-left: 28px;
  color: #2f4a60;
  line-height: 1.55;
}
.article-checklist li::before,
.article-question-panel li::before {
  content: "";
  position: absolute;
  left: 0;
  top: .42em;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--orange);
  box-shadow: 0 0 0 4px rgba(244, 155, 32, .16);
}
.article-question-panel {
  display: grid;
  grid-template-columns: .85fr 1.15fr;
  gap: clamp(20px, 4vw, 34px);
  align-items: start;
  padding: clamp(24px, 4vw, 34px);
  border-radius: 8px;
  background: #102e41;
}
.article-question-panel h2,
.article-question-panel p,
.article-question-panel li {
  color: white !important;
}
.article-question-panel .article-kicker {
  color: var(--orange) !important;
}
.article-note {
  padding: 20px 22px;
  border: 1px solid #f2d7a5;
  border-radius: 8px;
  background: #fff8eb;
}
.article-note strong {
  display: block;
  margin-bottom: 8px;
  color: #8b4b03;
}
.article-faq {
  padding-top: clamp(26px, 4vw, 42px);
  border-top: 1px solid rgba(210, 226, 234, .9);
}
.article-faq details {
  border: 1px solid #d8e9ef;
  border-radius: 8px;
  background: white;
}
.article-faq details + details {
  margin-top: 10px;
}
.article-faq summary {
  cursor: pointer;
  padding: 18px 20px;
  color: var(--blue-dark);
  font-weight: 900;
}
.article-faq details p {
  margin: 0;
  padding: 0 20px 20px;
  font-size: 16px;
}
.article-closing {
  padding: clamp(24px, 4vw, 34px);
  border-radius: 8px;
  background: #102e41;
}
.article-closing h2,
.article-closing p {
  color: white !important;
}
.article-closing .btn {
  margin-top: 22px;
}
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 clamp(28px, 5vw, 54px) clamp(30px, 5vw, 54px);
}
.article-tags span {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid rgba(0, 119, 123, .18);
  border-radius: 999px;
  color: #00777b;
  background: rgba(0, 119, 123, .08);
  font-size: 12px;
  font-weight: 800;
}
.sidebar {
  display: grid;
  gap: 16px;
  position: sticky;
  top: 98px;
}
.side-card {
  padding: 22px;
}
.side-card h3 {
  margin: 0 0 10px;
  color: var(--blue-dark);
  font-size: 20px;
  line-height: 1.25;
}
.side-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
}
.article-video { background: #f4fbfa; }
.article-video-frame {
  width: min(168px, 100%);
  margin: 14px auto 16px;
  overflow: hidden;
  border-radius: 8px;
  background: #103f3b;
  box-shadow: 0 12px 26px rgba(16, 63, 59, .18);
}
.article-video-player {
  display: block;
  width: 100%;
  aspect-ratio: 9 / 16;
  border: 0;
}
.article-video h3 { font-size: 17px; }
.article-video .text-link { font-size: 14px; }
.article-toc {
  display: grid;
  gap: 9px;
}
.article-toc .cat {
  margin-bottom: 4px;
}
.article-toc a {
  display: block;
  padding: 9px 0 9px 12px;
  border-left: 3px solid #d8e9ef;
  color: #36566d;
  text-decoration: none;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.25;
}
.article-toc a:hover {
  border-left-color: var(--orange);
  color: var(--blue-dark);
}
.side-card .btn {
  margin-top: 18px;
  width: 100%;
}
.side-card.newsletter {
  background: #102e41;
  color: white;
}
.side-card.newsletter h3,
.side-card.newsletter p {
  color: white;
}
.side-card.newsletter .btn {
  background: var(--orange);
  color: #102e41;
}
.related-list {
  display: grid;
  margin-top: 14px;
  border-top: 1px solid var(--line);
}
.related-list a {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
}
.related-list a:last-child {
  border-bottom: 0;
}
.related-number {
  color: #00777b;
  font-size: 12px;
  font-weight: 900;
}
.related-list span span {
  display: block;
  margin-bottom: 5px;
  color: #00777b;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.related-list strong {
  color: var(--blue-dark);
  font-size: 13px;
  line-height: 1.25;
}
.split,
.subhero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 44%);
  gap: clamp(28px, 5vw, 70px);
  align-items: center;
}
.split img,
.subhero img {
  width: 100%;
  max-height: 620px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: var(--shadow);
}
.subhero {
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(58px, 8vw, 105px) 0 clamp(38px, 6vw, 74px);
}
.subhero h1,
.page-intro h1 { color: var(--blue-dark); }
.subhero > div > p:not(.eyebrow),
.page-intro > p:not(.eyebrow) { font-size: 20px; color: var(--muted); }
.coming-soon-hero {
  min-height: calc(100vh - 86px);
  display: grid;
  place-items: center;
  padding: clamp(70px, 10vw, 130px) 20px;
  background:
    linear-gradient(135deg, rgba(244, 248, 251, .95), rgba(255, 255, 255, .98)),
    radial-gradient(circle at 18% 20%, rgba(244, 155, 32, .14), transparent 30%),
    radial-gradient(circle at 82% 72%, rgba(15, 111, 168, .14), transparent 34%);
}
.coming-soon-panel {
  width: min(760px, 100%);
  padding: clamp(34px, 6vw, 64px);
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 255, 255, .9);
  box-shadow: var(--shadow);
  text-align: center;
}
.coming-soon-panel h1 {
  margin: 0 0 18px;
  color: var(--blue-dark);
  font-size: clamp(46px, 8vw, 86px);
}
.coming-soon-panel > p:not(.eyebrow) {
  max-width: 620px;
  margin: 0 auto;
  color: var(--muted);
  font-size: 20px;
}
.coming-soon-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}
.consortium-hero {
  min-height: clamp(560px, 70vh, 760px);
  display: grid;
  align-items: end;
  padding: clamp(76px, 9vw, 128px) clamp(20px, 7vw, 104px);
  color: white;
  background:
    linear-gradient(120deg, rgba(11, 37, 55, .94), rgba(11, 37, 55, .75) 48%, rgba(11, 37, 55, .38)),
    linear-gradient(135deg, #183f58, #0d2334 58%, #2d596f);
}
.consortium-hero > div {
  width: min(820px, 100%);
}
.consortium-hero h1 {
  max-width: 760px;
  color: white;
}
.consortium-hero p:not(.eyebrow) {
  max-width: 680px;
  color: rgba(255,255,255,.86);
  font-size: clamp(18px, 2vw, 23px);
}
.consortium-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}
.consortium-tags span {
  padding: 8px 12px;
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 999px;
  background: rgba(255,255,255,.1);
  color: white;
  font-weight: 800;
}
.consortium-context {
  display: grid;
  grid-template-columns: minmax(0, .78fr) minmax(0, 1fr);
  gap: clamp(28px, 6vw, 78px);
  align-items: start;
  border-bottom: 1px solid var(--line);
}
.consortium-context > p {
  margin: 0;
  color: var(--muted);
  font-size: 20px;
}
.consortium-risks {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  padding-top: 0;
}
.consortium-risks article {
  min-height: 226px;
  padding: 30px;
  border-top: 3px solid var(--orange);
  border-right: 1px solid var(--line);
  background: var(--soft);
}
.consortium-risks article:last-child { border-right: 0; }
.consortium-risks span {
  display: block;
  margin-bottom: 24px;
  color: var(--orange);
  font-size: 16px;
  font-weight: 900;
}
.consortium-risks h3 {
  margin: 0 0 10px;
  color: var(--blue-dark);
  font-size: 21px;
}
.consortium-risks p { margin: 0; color: var(--muted); }
.method-steps,
.type-list,
.partner-briefs {
  display: grid;
  gap: 0;
  border-top: 1px solid #cfdfe8;
}
.method-steps article,
.type-list article,
.partner-briefs article {
  display: grid;
  grid-template-columns: 70px minmax(160px, .36fr) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
  padding: 22px 0;
  border-bottom: 1px solid #dbe7ee;
}
.method-steps span {
  color: var(--orange);
  font-size: 24px;
  font-weight: 900;
}
.method-steps h3,
.type-list h3,
.partner-briefs strong {
  color: var(--blue-dark);
  font-size: 20px;
}
.method-steps p,
.type-list p,
.partner-briefs p {
  margin: 0;
  color: var(--muted);
}
.consortium-types {
  display: grid;
  grid-template-columns: minmax(0, .72fr) minmax(0, 1fr);
  gap: clamp(28px, 6vw, 78px);
}
.type-list article {
  grid-template-columns: minmax(160px, .4fr) minmax(0, 1fr);
}
.consortium-specialist {
  display: grid;
  grid-template-columns: minmax(220px, 340px) minmax(0, 1fr);
  gap: clamp(28px, 6vw, 72px);
  align-items: center;
  padding-top: clamp(34px, 6vw, 80px);
  padding-bottom: clamp(34px, 6vw, 80px);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.consortium-specialist img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: var(--shadow);
}
.consortium-specialist p:not(.eyebrow) {
  color: var(--muted);
  font-size: 18px;
}
.consortium-credentials {
  display: grid;
  gap: 9px;
  margin: 24px 0 0;
  padding: 0;
  color: var(--blue-dark);
  font-weight: 750;
  list-style: none;
}
.consortium-credentials li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.consortium-credentials li::before {
  content: '✓';
  color: var(--orange);
  font-weight: 900;
}
.partner-briefs {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  border-top: 0;
}
.partner-briefs article {
  display: block;
  min-height: 180px;
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--soft);
}
.partner-briefs strong {
  display: block;
  margin-bottom: 10px;
}
.partner-briefs img {
  display: block;
  width: 100%;
  height: 84px;
  margin-bottom: 22px;
  object-fit: contain;
  object-position: left center;
}
.consortium-testimonials {
  display: grid;
  grid-template-columns: minmax(0, .72fr) minmax(0, 1fr);
  gap: clamp(30px, 7vw, 100px);
  align-items: start;
  border-top: 1px solid var(--line);
}
.consortium-testimonials > div:last-child {
  display: grid;
  gap: 16px;
}
.consortium-testimonials blockquote {
  margin: 0;
  padding: 24px 0 24px 24px;
  border-left: 3px solid var(--orange);
  color: var(--blue-dark);
  font-size: 19px;
  line-height: 1.45;
  font-weight: 700;
}
.consortium-testimonials cite {
  display: block;
  margin-top: 12px;
  color: var(--muted);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
}
.consortium-cta {
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto clamp(56px, 8vw, 96px);
  padding: clamp(34px, 6vw, 70px);
  border-radius: 8px;
  background: #102e41;
  color: white;
  text-align: center;
}
.consortium-cta h2 {
  color: white;
}
.page-intro {
  width: min(940px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(58px, 8vw, 105px) 0 clamp(30px, 5vw, 60px);
  text-align: center;
}
.page-intro.narrow { max-width: 760px; }
.logo-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 18px;
  align-items: center;
}
.logo-strip img {
  width: 100%;
  height: 86px;
  object-fit: contain;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: white;
}
.article-body {
  max-width: 850px;
  font-size: 18px;
}
.article-body h2 { margin-top: 38px; color: var(--blue-dark); font-size: clamp(24px, 3vw, 34px); }
.article-body p { margin: 0 0 18px; }
.article-body .bullet::before { content: "• "; color: var(--orange); font-weight: 700; }
.contact-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 28px;
  align-items: start;
}
.contact-layout-single {
  display: block;
  max-width: 780px;
}
.contact-form,
.contact-panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--soft);
  padding: 26px;
}
.contact-form label { display: grid; gap: 8px; margin-bottom: 16px; color: var(--blue-dark); font-weight: 700; }
input, textarea, select {
  width: 100%;
  border: 1px solid #c8d7e1;
  border-radius: 4px;
  padding: 12px;
  font: inherit;
  background: white;
  color: var(--ink);
}
select {
  min-height: 48px;
  appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--blue-dark) 50%),
    linear-gradient(135deg, var(--blue-dark) 50%, transparent 50%);
  background-position:
    calc(100% - 19px) calc(50% + 1px),
    calc(100% - 13px) calc(50% + 1px);
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
  padding-right: 42px;
}
.contact-form .consent-row {
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 10px;
  margin: 4px 0 18px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
}
.contact-form .consent-row input {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: var(--orange);
}
.form-status {
  display: none;
  margin: 0 0 14px;
  padding: 11px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
}
.form-status.show {
  display: block;
}
.form-status.success {
  border: 1px solid rgba(20, 130, 86, .24);
  background: #eefaf4;
  color: #166342;
}
.form-status.error {
  border: 1px solid rgba(190, 45, 45, .24);
  background: #fff2f1;
  color: #9b2727;
}
.exit-popup {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 22px;
  background: rgba(8, 22, 34, .62);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity .22s ease, visibility .22s ease;
  backdrop-filter: blur(10px);
}
.exit-popup.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.exit-popup-dialog {
  position: relative;
  width: min(860px, 100%);
  max-height: min(92vh, 820px);
  display: grid;
  grid-template-columns: .86fr 1fr;
  overflow: hidden;
  border-radius: 10px;
  background: white;
  box-shadow: 0 30px 90px rgba(4, 17, 28, .34);
  transform: translateY(12px) scale(.98);
  transition: transform .22s ease;
}
.exit-popup.open .exit-popup-dialog {
  transform: translateY(0) scale(1);
}
.exit-popup-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(220, 230, 238, .92);
  border-radius: 50%;
  background: rgba(255, 255, 255, .95);
  color: var(--blue-dark);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}
.exit-popup-intro {
  padding: clamp(28px, 4vw, 42px);
  background:
    linear-gradient(145deg, rgba(23, 71, 98, .96), rgba(10, 36, 55, .98)),
    linear-gradient(90deg, rgba(244, 155, 32, .18), transparent);
  color: white;
}
.exit-popup-intro h2 {
  margin-bottom: 14px;
  font-size: clamp(28px, 4vw, 42px);
}
.exit-popup-intro p {
  margin: 0;
  color: rgba(255,255,255,.86);
}
.exit-popup-intro ul {
  display: grid;
  gap: 10px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}
.exit-popup-intro li {
  padding-left: 18px;
  position: relative;
  color: rgba(255,255,255,.9);
  font-size: 14px;
  font-weight: 700;
}
.exit-popup-intro li::before {
  content: "";
  position: absolute;
  left: 0;
  top: .72em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--orange);
}
.exit-popup .contact-form {
  max-height: min(92vh, 820px);
  overflow-y: auto;
  border: 0;
  border-radius: 0;
  background: white;
  padding: clamp(28px, 4vw, 42px);
}
.exit-popup .contact-form label {
  margin-bottom: 12px;
}
.exit-popup .contact-form textarea {
  min-height: 96px;
}
body.modal-open {
  overflow: hidden;
}
.download-card img,
.post-card img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: var(--soft);
}
.download-card > div,
.post-card > div { padding: 22px; }
.download-card h2,
.post-card h2 { font-size: 22px; }
.post-card h2 a { text-decoration: none; }
.post-meta { color: var(--muted); font-size: 14px; }
.filter-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 26px;
}
.filter-row button {
  border: 1px solid var(--line);
  background: white;
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
}
.filter-row button.active { background: var(--blue); color: white; border-color: var(--blue); }
.post-article {
  width: min(900px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(50px, 8vw, 90px) 0 20px;
}
.post-article header { text-align: center; }
.post-cover {
  width: 100%;
  max-height: 560px;
  object-fit: cover;
  border-radius: 8px;
  margin: 34px 0 42px;
  box-shadow: var(--shadow);
}
.related-posts { border-top: 1px solid var(--line); }
.mini-posts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.mini-posts a {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 14px;
  align-items: center;
  text-decoration: none;
  color: var(--ink);
}
.mini-posts img {
  width: 92px;
  height: 72px;
  object-fit: cover;
  border-radius: 6px;
}
.site-footer {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 34px;
  padding: clamp(38px, 6vw, 70px) clamp(20px, 5vw, 70px);
  background: #103F3B;
  color: white;
}
.site-footer a { color: white; }
.site-footer h2 { font-size: 20px; color: var(--orange); }
.footer-logo { width: 240px; margin-bottom: 18px; display: block; background: transparent; padding: 0; border-radius: 0; }
.footer-seal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, .18);
  border-left: 4px solid #DA9F3C;
  border-radius: 999px;
  background: rgba(16, 63, 59, .28);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .02em;
  width: fit-content;
}
.cookie-bar {
  position: fixed;
  left: 20px;
  right: 20px;
  bottom: 20px;
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 850px;
  margin: 0 auto;
  padding: 14px 16px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow);
  z-index: 30;
}
.cookie-bar.show { display: flex; }
.cookie-bar p { margin: 0; }
.will-reveal {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity .45s ease var(--reveal-delay, 0ms),
    transform .45s ease var(--reveal-delay, 0ms),
    border-color .18s ease,
    box-shadow .18s ease,
    background .18s ease;
}
.will-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: .001ms !important;
    animation-duration: .001ms !important;
  }
  .will-reveal {
    opacity: 1;
    transform: none;
  }
}
@media (max-width: 900px) {
  html,
  body {
    max-width: 100%;
    overflow-x: hidden;
  }
  .site-header {
    min-height: 74px;
    z-index: 70;
    box-shadow: 0 10px 26px rgba(12, 38, 56, .08);
  }
  .nav-toggle {
    display: inline-flex;
    border: 1px solid var(--line);
    background: white;
    border-radius: 8px;
    padding: 9px 12px;
    box-shadow: 0 8px 20px rgba(29, 72, 99, .08);
  }
  .main-nav {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    z-index: 69;
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    max-height: calc(100vh - 74px);
    padding: 12px 20px 18px;
    overflow-y: auto;
    background: white;
    border-bottom: 1px solid var(--line);
    box-shadow: 0 22px 45px rgba(12, 38, 56, .14);
  }
  .main-nav.open { display: flex; }
  .main-nav a {
    padding: 13px 0;
    font-size: 15px;
  }
  .nav-dropdown {
    margin: 2px 0 4px;
    padding: 0;
    border-bottom: 1px solid var(--line);
  }
  .nav-dropdown-trigger {
    width: 100%;
    min-height: 48px;
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: 8px;
    text-align: left;
    color: var(--blue-dark);
    font-weight: 700;
  }
  .nav-dropdown.open .nav-dropdown-trigger {
    border-color: rgba(244, 155, 32, .45);
    background: #fffaf0;
  }
  .nav-dropdown-trigger::after {
    top: 18px;
    right: 12px;
  }
  .dropdown-menu {
    position: static;
    min-width: 0;
    padding: 4px 0 12px;
    border: 0;
    box-shadow: none;
    opacity: 1;
    visibility: visible;
    transform: none;
    display: none;
  }
  .nav-dropdown.open .dropdown-menu,
  .nav-dropdown:focus-within .dropdown-menu {
    display: block;
    transform: none;
  }
  .dropdown-menu a {
    margin: 2px 0 2px 18px;
    padding: 10px 12px;
    border-radius: 8px;
    background: #f7fbfd;
    color: #29465b;
  }
  .home-hero,
  .info-layout,
  .ewerton-profile,
  .service-showcase-slide,
  .platinum-auto-inner,
  .consortium-focus-shell,
  .consortium-context,
  .consortium-types,
  .consortium-specialist,
  .blog-library-head,
  .article-shell,
  .business-section {
    grid-template-columns: 1fr;
  }
  .ecosystem-heading {
    position: static;
  }
  .service-carousel-head {
    grid-template-columns: 1fr;
    align-items: start;
  }
  .service-carousel-side {
    width: 50px;
    height: 50px;
    font-size: 32px;
  }
  .service-carousel-side-prev {
    left: -14px;
  }
  .service-carousel-side-next {
    right: -14px;
  }
  .service-showcase-slide {
    min-height: 0;
    align-items: stretch;
  }
  .service-showcase-panel {
    width: min(680px, 100%);
  }
  .consortium-focus-map {
    padding-left: 22px;
  }
  .platinum-auto-section {
    background:
      radial-gradient(circle at 12% 8%, rgba(244, 155, 32, .2), transparent 32%),
      linear-gradient(180deg, #0b2537 0%, #102e41 62%, #edf4f7 62%, #f7fbfd 100%);
  }
  .platinum-auto-copy {
    max-width: 760px;
  }
  .platinum-auto-partners {
    width: min(620px, 100%);
  }
  .ecosystem-lanes a,
  .service-showcase-panel li,
  .method-steps article,
  .type-list article {
    grid-template-columns: 54px minmax(150px, .42fr) minmax(0, 1fr);
  }
  .partner-briefs {
    grid-template-columns: 1fr;
  }
  .article-scan-grid,
  .article-question-panel {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: static;
  }
  .ewerton-photo-wrap {
    width: min(420px, 100%);
  }
  .hero-panel {
    max-width: 560px;
  }
  .service-grid,
  .process-grid,
  .latest-grid,
  .ewerton-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .service-tile {
    grid-template-columns: 72px 1fr;
  }
  .service-tile p,
  .service-tile a {
    grid-column: 2;
  }
  .process-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 42px;
  }
  .partners-marquee-head {
    grid-template-columns: 1fr;
  }
  .hero { min-height: 620px; }
  .hero-content { margin: 0 auto; }
  .quick-dock {
    grid-template-columns: 1fr;
    margin-top: 0;
    width: 100%;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
  }
  .quick-dock a {
    min-height: 86px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .product-grid,
  .blog-grid,
  .download-grid,
  .mini-posts,
  .site-footer,
  .contact-layout,
  .split,
  .subhero {
    grid-template-columns: 1fr;
  }
  .subhero img { max-height: 420px; }
  .floating-socials {
    right: 16px;
    bottom: 16px;
    gap: 10px;
  }
  .floating-social-button {
    width: 44px;
    height: 44px;
  }
  .floating-social-button svg {
    width: 22px;
    height: 22px;
  }
  .exit-popup {
    padding: 14px;
  }
  .exit-popup-dialog {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
  .exit-popup-intro {
    padding: 26px 24px 22px;
  }
  .exit-popup-intro h2 {
    max-width: 520px;
  }
  .exit-popup-intro ul {
    grid-template-columns: 1fr;
    margin-top: 18px;
  }
  .exit-popup .contact-form {
    max-height: none;
    padding: 24px;
  }
}
@media (max-width: 560px) {
  body {
    padding-bottom: 70px;
  }
  .site-header {
    min-height: 72px;
    padding: 10px 16px;
    gap: 12px;
  }
  .brand img {
    width: min(214px, calc(100vw - 92px));
  }
  .nav-toggle {
    display: inline-flex !important;
    position: static;
    margin-left: auto;
    width: 44px;
    height: 44px;
    padding: 0;
    justify-content: center;
    align-items: center;
    color: var(--blue-dark);
    font-size: 0;
  }
  .nav-toggle::before {
    content: "☰";
    font-size: 24px;
    line-height: 1;
  }
  h1 { font-size: 34px; }
  .section,
  .blog-library,
  .videos-hero,
  .video-library,
  .article-shell,
  .subhero {
    width: min(100% - 28px, 1160px);
  }
  .home-hero {
    width: 100%;
    padding-top: 0;
  }
  .home-hero-visual {
    width: 100%;
    min-height: clamp(660px, 92vh, 840px);
    padding: 54px 16px 52px;
    gap: 26px;
    align-items: center;
    justify-items: start;
  }
  .home-hero-visual::before {
    background:
      linear-gradient(90deg, rgba(12, 38, 56, .94) 0%, rgba(12, 38, 56, .78) 52%, rgba(12, 38, 56, .22) 82%, rgba(12, 38, 56, .06) 100%),
      linear-gradient(180deg, rgba(12, 38, 56, .12), rgba(12, 38, 56, .24));
  }
  .hero-bg-slide {
    object-position: 62% center !important;
  }
  .home-hero h1 {
    max-width: 100%;
    font-size: clamp(28px, 8.2vw, 34px);
    line-height: 1.08;
    overflow-wrap: anywhere;
  }
  .home-hero-visual h1 {
    color: white;
  }
  .home-hero-visual .home-hero-copy {
    width: 100%;
    justify-items: start;
    text-align: left;
  }
  .home-hero-visual .actions {
    justify-content: flex-start;
  }
  .home-hero-copy > p:not(.eyebrow) {
    font-size: 17px;
    line-height: 1.65;
  }
  .home-hero-visual .home-hero-copy > p:not(.eyebrow) {
    color: rgba(255,255,255,.88);
  }
  .hero-bg-action-layer {
    position: relative;
    right: auto;
    top: auto;
    bottom: auto;
    width: 100%;
    margin-top: 24px;
  }
  .hero-bg-action {
    min-height: 68px;
    padding: 12px 48px 12px 14px;
  }
  .hero-bg-action strong {
    font-size: 16px;
  }
  .hero-bg-action::after {
    right: 14px;
    width: 28px;
    height: 28px;
  }
  .hero-panel-card {
    position: static;
    margin-top: 14px;
  }
  .hero-summary-panel .hero-panel-card {
    margin: -46px 10px 0;
    padding: 18px;
  }
  .author-row {
    align-items: flex-start;
    flex-direction: column;
  }
  .share-button {
    width: 100%;
  }
  .service-grid,
  .info-grid,
  .process-grid,
  .latest-grid,
  .ewerton-card-grid {
    grid-template-columns: 1fr;
  }
  .post-card {
    min-height: 0;
  }
  .post-card-body {
    padding: 18px;
  }
  .post-card h2,
  .post-card h3 {
    font-size: 18px;
  }
  .post-card footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
  .service-tile {
    grid-template-columns: 56px 1fr;
    gap: 14px;
    padding: 22px 0;
  }
  .service-tile::before {
    width: 44px;
    height: 44px;
  }
  .service-tile::after {
    left: 70px;
  }
  .service-tile h3,
  .service-tile p,
  .service-tile a {
    grid-column: 2;
  }
  .ecosystem-lanes a,
  .service-showcase-panel li,
  .method-steps article,
  .type-list article {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .service-showcase-panel li::before {
    width: 42px;
    height: 42px;
  }
  .service-carousel-section {
    width: min(100% - 28px, 1220px);
    padding: 38px 0 44px;
  }
  .service-carousel-head {
    margin-bottom: 18px;
  }
  .service-carousel-head p:not(.eyebrow) {
    font-size: 16px;
  }
  .service-carousel-side {
    top: 50%;
    bottom: auto;
    width: 38px;
    height: 38px;
    font-size: 25px;
    transform: translateY(-50%);
  }
  .service-carousel-side:hover {
    transform: translateY(-50%) scale(1.05);
  }
  .service-carousel-side-prev {
    left: -10px;
  }
  .service-carousel-side-next {
    left: auto;
    right: -10px;
  }
  .service-showcase-slide {
    padding: 22px 64px;
    gap: 18px;
  }
  .service-showcase-name {
    gap: 7px;
    margin-bottom: 16px;
    padding: 6px 9px 6px 6px;
  }
  .service-showcase-name strong {
    font-size: 12px;
  }
  .service-showcase-copy h3 {
    font-size: clamp(25px, 8vw, 34px);
    line-height: 1.05;
  }
  .service-showcase-copy p:not(.eyebrow) {
    font-size: 16px;
  }
  .service-showcase-count {
    width: 34px;
    height: 34px;
  }
  .service-showcase-actions {
    flex-direction: column;
  }
  .service-showcase-actions .btn {
    width: 100%;
    justify-content: center;
  }
  .service-showcase-panel {
    padding: 18px 14px;
  }
  .service-showcase-panel strong {
    font-size: 16px;
  }
  .service-showcase-panel span {
    font-size: 14px;
  }
  .ecosystem-lanes a {
    min-height: 0;
  }
  .platinum-auto-section {
    padding: 46px 0;
  }
  .consortium-focus-section {
    padding: 48px 0;
  }
  .consortium-focus-shell {
    width: min(100% - 28px, 1160px);
  }
  .consortium-focus-copy h2 {
    font-size: clamp(32px, 10vw, 44px);
  }
  .consortium-focus-actions {
    flex-direction: column;
  }
  .consortium-focus-actions .btn {
    width: 100%;
    justify-content: center;
  }
  .consortium-focus-map {
    padding-left: 18px;
  }
  .consortium-focus-map article {
    grid-template-columns: 58px minmax(0, 1fr);
    gap: 12px;
    padding: 22px 0;
  }
  .consortium-focus-map span {
    font-size: 34px;
  }
  .consortium-focus-map h3 {
    font-size: 24px;
  }
  .platinum-auto-inner {
    width: min(100% - 28px, 1160px);
  }
  .platinum-auto-actions {
    flex-direction: column;
  }
  .platinum-auto-actions .btn {
    width: 100%;
    justify-content: center;
  }
  .platinum-auto-road::before {
    left: 21px;
  }
  .platinum-auto-road article {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 12px;
  }
  .platinum-auto-road span {
    width: 44px;
    height: 44px;
    font-size: 13px;
  }
  .platinum-partner-row {
    grid-template-columns: 62px minmax(0, 1fr);
    gap: 12px;
  }
  .platinum-partner-mark {
    width: 58px;
    height: 58px;
  }
  .platinum-partner-mark img {
    width: 48px;
  }
  .platinum-partner-mark strong {
    font-size: 10px;
  }
  .consortium-hero {
    min-height: 560px;
    padding: 64px 18px 56px;
  }
  .consortium-tags {
    gap: 8px;
  }
  .consortium-tags span {
    font-size: 13px;
  }
  .consortium-risks,
  .consortium-testimonials {
    grid-template-columns: 1fr;
  }
  .consortium-risks {
    gap: 12px;
    padding-top: 0;
  }
  .consortium-risks article {
    min-height: 0;
    padding: 22px;
    border: 1px solid var(--line);
    border-top: 3px solid var(--orange);
  }
  .consortium-risks span { margin-bottom: 14px; }
  .consortium-testimonials { gap: 26px; }
  .consortium-cta {
    width: min(100% - 28px, 1160px);
    padding: 32px 18px;
  }
  .process-grid {
    border-top: 0;
    gap: 26px;
  }
  .process-grid article {
    padding: 0 0 0 22px;
    border-left: 2px solid #d3e2ea;
  }
  .process-grid article::before {
    top: 0;
    left: -9px;
  }
  .partner-pill {
    width: 246px;
    min-height: 86px;
    grid-template-columns: 62px 1fr;
  }
  .partner-mark {
    width: 62px;
    height: 62px;
  }
  .partner-mark img[src*="rodobens-consorcio"],
  .partner-mark img[src*="porto-consorcio"] {
    width: 58px;
    height: 58px;
  }
  .partner-text {
    max-width: 134px;
  }
  .partner-text strong {
    font-size: 13px;
  }
  .partner-text small {
    font-size: 11px;
  }
  .ewerton-section {
    padding: 48px 14px;
  }
  .ewerton-profile {
    gap: 24px;
  }
  .ewerton-photo-wrap {
    width: min(100%, 340px);
    margin: 0 auto;
  }
  .ewerton-copy h2 {
    font-size: 30px;
  }
  .ewerton-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .blog-library-head h1 {
    font-size: 36px;
    line-height: 1.05;
  }
  .videos-hero {
    display: block;
    min-height: 0;
    padding: 66px 22px 42px;
  }
  .videos-hero > p { margin-top: 22px; font-size: 16px; }
  .videos-hero h1 { font-size: clamp(39px, 12vw, 55px); }
  .video-item {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 38px 0;
  }
  .video-frame { width: min(270px, 100%); }
  .video-copy { padding-right: 48px; }
  .video-copy h2 { font-size: 30px; }
  .video-copy > p:not(.cat) { font-size: 16px; }
  .article-video-frame { width: min(210px, 100%); }
  .home-video-section {
    padding: 52px 14px;
  }
  .home-video-head {
    display: block;
    margin-bottom: 32px;
  }
  .home-video-head > div:last-child { margin-top: 20px; }
  .home-video-head h2 { font-size: 35px; }
  .home-video-list {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .home-video-item {
    grid-template-columns: 118px minmax(0, 1fr);
    gap: 16px;
  }
  .home-video-copy h3 { font-size: 22px; }
  .article-shell {
    gap: 18px;
    padding: 30px 0 58px;
  }
  .article-main,
  .side-card {
    border-radius: 8px;
    box-shadow: 0 12px 30px rgba(29, 72, 99, .08);
  }
  .article-cover {
    min-height: 220px;
    aspect-ratio: 1.18 / 1;
  }
  .article-head {
    padding: 22px 18px;
  }
  .article-head h1 {
    font-size: clamp(30px, 9vw, 38px);
    line-height: 1.06;
  }
  .article-head > p {
    font-size: 16px;
    line-height: 1.65;
  }
  .article-main .article-body {
    gap: 22px;
    padding: 22px 18px 28px;
    font-size: 16px;
  }
  .article-main .article-body p {
    line-height: 1.72;
  }
  .article-brief,
  .article-section,
  .article-check-panel,
  .article-question-panel,
  .article-note,
  .article-faq,
  .article-closing {
    border-radius: 8px;
  }
  .article-scan-grid {
    gap: 10px;
  }
  .article-tags {
    padding: 0 18px 26px;
  }
  .side-card {
    padding: 18px;
  }
  .coming-soon-hero {
    min-height: calc(100vh - 72px);
    padding: 44px 14px 56px;
  }
  .coming-soon-panel {
    padding: 32px 20px;
  }
  .coming-soon-panel h1 {
    font-size: 46px;
  }
  .coming-soon-actions {
    flex-direction: column;
  }
  .links-stage {
    min-height: 100svh;
    padding: 28px 14px 92px;
  }
  .links-card {
    width: min(100%, 352px);
    padding: 28px 18px;
  }
  .bio-link {
    min-height: 50px;
  }
  .links-socials {
    gap: 8px;
  }
  .social-button {
    width: 46px;
    height: 46px;
  }
  .business-section {
    padding: 28px 20px;
    border-radius: 0;
    width: 100%;
  }
  .site-footer {
    gap: 24px;
    padding: 38px 20px 96px;
  }
  .footer-logo {
    width: min(230px, 100%);
  }
  .floating-socials {
    left: 50%;
    right: auto;
    bottom: 12px;
    width: auto;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border: 1px solid rgba(220, 230, 238, .9);
    border-radius: 999px;
    background: rgba(255, 255, 255, .92);
    box-shadow: 0 18px 42px rgba(12, 38, 56, .18);
    transform: translateX(-50%);
    backdrop-filter: blur(12px);
  }
  .floating-social-button {
    width: 42px;
    height: 42px;
    box-shadow: none;
  }
  .floating-social-button svg {
    width: 21px;
    height: 21px;
  }
  .floating-tooltip {
    display: none;
  }
  .hero h1 { max-width: 10ch; }
  .hero p:not(.eyebrow) { font-size: 18px; max-width: 18rem; }
  .actions { flex-direction: column; align-items: stretch; }
  .cookie-bar {
    flex-direction: column;
    align-items: stretch;
    right: auto;
    width: min(calc(100vw - 40px), 350px);
  }
  .hero-micro { display: none; }
}
`;

const clientJs = `
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('.nav-dropdown-trigger').forEach((button) => {
  button.addEventListener('click', () => {
    const dropdown = button.closest('.nav-dropdown');
    const open = dropdown?.classList.toggle('open');
    button.setAttribute('aria-expanded', String(Boolean(open)));
  });
});

const slides = [...document.querySelectorAll('.hero-slide')];
let slideIndex = 0;
if (slides.length > 1) {
  setInterval(() => {
    slides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
  }, 4200);
}

document.querySelectorAll('[data-hero-bg-rotator]').forEach((rotator) => {
  const bgSlides = [...rotator.querySelectorAll('.hero-bg-slide')];
  const bgActions = [...document.querySelectorAll('[data-hero-bg-action]')];
  let bgIndex = 0;
  if (bgSlides.length <= 1) return;

  setInterval(() => {
    bgSlides[bgIndex].classList.remove('active');
    bgActions[bgIndex]?.classList.remove('active');
    bgIndex = (bgIndex + 1) % bgSlides.length;
    bgSlides[bgIndex].classList.add('active');
    bgActions[bgIndex]?.classList.add('active');
  }, 3000);
});

document.querySelectorAll('[data-service-carousel]').forEach((viewport) => {
  const section = viewport.closest('.service-carousel-section');
  const serviceSlides = [...viewport.querySelectorAll('[data-service-slide]')];
  const dots = [...(section?.querySelectorAll('[data-service-dot]') || [])];
  const prev = section?.querySelector('[data-service-prev]');
  const next = section?.querySelector('[data-service-next]');
  if (!serviceSlides.length) return;

  const currentIndex = () => {
    let active = 0;
    let distance = Number.POSITIVE_INFINITY;
    serviceSlides.forEach((slide, index) => {
      const slideDistance = Math.abs(slide.offsetLeft - viewport.scrollLeft);
      if (slideDistance < distance) {
        distance = slideDistance;
        active = index;
      }
    });
    return active;
  };

  const setActiveDot = () => {
    const active = currentIndex();
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === active);
      if (index === active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  const goTo = (index) => {
    const nextIndex = (index + serviceSlides.length) % serviceSlides.length;
    viewport.scrollTo({ left: serviceSlides[nextIndex].offsetLeft, behavior: 'smooth' });
  };

  prev?.addEventListener('click', () => goTo(currentIndex() - 1));
  next?.addEventListener('click', () => goTo(currentIndex() + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));

  let isDragging = false;
  let startX = 0;
  let startLeft = 0;
  let moved = false;

  const finishDrag = (event) => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('is-dragging');
    viewport.releasePointerCapture?.(event.pointerId);
    setActiveDot();
  };

  viewport.addEventListener('pointerdown', (event) => {
    if (event.button && event.button !== 0) return;
    isDragging = true;
    moved = false;
    startX = event.clientX;
    startLeft = viewport.scrollLeft;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture?.(event.pointerId);
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 6) moved = true;
    viewport.scrollLeft = startLeft - delta;
  });

  viewport.addEventListener('pointerup', finishDrag);
  viewport.addEventListener('pointercancel', finishDrag);
  viewport.addEventListener('click', (event) => {
    if (!moved) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  let scrollTimer;
  viewport.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(setActiveDot, 80);
  }, { passive: true });

  setActiveDot();
});

const revealCards = [...document.querySelectorAll('.service-tile, .service-showcase-slide, .service-showcase-panel li, .consortium-focus-map article, .info-grid article, .process-grid article, .latest-grid article, .ewerton-card, .method-steps article, .type-list article, .partner-briefs article')];
if (revealCards.length && 'IntersectionObserver' in window) {
  revealCards.forEach((card, index) => {
    card.classList.add('will-reveal');
    card.style.setProperty('--reveal-delay', String((index % 6) * 55) + 'ms');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

  revealCards.forEach((card) => revealObserver.observe(card));
} else {
  revealCards.forEach((card) => card.classList.add('is-visible'));
}

const cookieBar = document.querySelector('[data-cookie-bar]');
if (cookieBar && localStorage.getItem('hirayama-cookie-ok') !== '1') {
  cookieBar.classList.add('show');
}
document.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
  localStorage.setItem('hirayama-cookie-ok', '1');
  cookieBar?.classList.remove('show');
});

const setFormStatus = (form, message, state) => {
  const status = form.querySelector('[data-form-status]');
  if (!status) return;
  status.textContent = message;
  status.classList.remove('success', 'error');
  status.classList.add('show', state);
};

const resetConsent = (form) => {
  const consent = form.querySelector('input[name="consentimento"]');
  if (consent) consent.checked = true;
};

const EXIT_INTENT_SESSION_KEY = 'hirayama_exit_intent_shown';

document.querySelectorAll('[data-contact-form]').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const defaultText = button?.textContent || 'Enviar solicitação';
    const data = new FormData(form);
    const serviceSelect = form.querySelector('select[name="servico"]');
    const serviceLabel = serviceSelect?.selectedOptions?.[0]?.textContent?.trim() || String(data.get('servico') || '');
    const name = String(data.get('nome') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('telefone') || '').trim();
    const message = String(data.get('message') || '').trim();
    const source = String(data.get('origem') || 'site').trim();
    data.set('_page_url', location.href);
    data.set('_replyto', email);
    data.set('_subject', '[Site Hirayama Corretora] ' + (serviceLabel || 'Novo contato') + (name ? ' - ' + name : ''));
    data.set('servico_nome', serviceLabel);
    data.set('message', [
      'Novo contato pelo site Hirayama Corretora.',
      '',
      'Nome: ' + name,
      'Email: ' + email,
      'Telefone: ' + phone,
      'Serviço desejado: ' + serviceLabel,
      'Origem: ' + source,
      'Página: ' + location.href,
      '',
      'Mensagem:',
      message || 'Quero falar com a Hirayama Corretora.'
    ].join('\\n'));

    if (!data.get('servico')) {
      setFormStatus(form, 'Selecione o serviço para a equipe entender melhor sua necessidade.', 'error');
      return;
    }

    try {
      if (button) {
        button.disabled = true;
        button.textContent = 'Enviando...';
      }
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.');
      }
      setFormStatus(form, 'Recebemos sua solicitação. A Hirayama vai retornar em breve.', 'success');
      form.reset();
      resetConsent(form);
      try {
        sessionStorage.setItem(EXIT_INTENT_SESSION_KEY, '1');
      } catch {
        // Storage can be blocked in private browsing.
      }
      if (form.closest('[data-exit-popup]')) {
        window.setTimeout(() => closeExitPopup(), 1400);
      }
    } catch (error) {
      setFormStatus(form, error?.message || 'Não foi possível enviar agora. Tente novamente.', 'error');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = defaultText;
      }
    }
  });
});

const exitPopup = document.querySelector('[data-exit-popup]');

function closeExitPopup() {
  if (!exitPopup) return;
  exitPopup.classList.remove('open');
  exitPopup.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function openExitPopup(source) {
  if (!exitPopup || exitPopup.classList.contains('open')) return;
  const sourceField = exitPopup.querySelector('input[name="origem"]');
  if (sourceField && source) sourceField.value = source;
  exitPopup.classList.add('open');
  exitPopup.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  window.setTimeout(() => exitPopup.querySelector('.contact-form input:not([type="hidden"]), .contact-form select, .contact-form textarea, .contact-form button')?.focus(), 80);
}

function useExitIntent({ onExitIntent, delayMs = 5000, storageKey = EXIT_INTENT_SESSION_KEY } = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};
  if (typeof onExitIntent !== 'function') return () => {};
  if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return () => {};

  let canTrigger = false;
  let disposed = false;
  let timer;

  const hasShown = () => {
    try {
      return sessionStorage.getItem(storageKey) === '1';
    } catch {
      return false;
    }
  };

  const markShown = () => {
    try {
      sessionStorage.setItem(storageKey, '1');
    } catch {
      // Storage can be blocked in private browsing.
    }
  };

  function cleanup() {
    if (disposed) return;
    disposed = true;
    if (timer) window.clearTimeout(timer);
    window.removeEventListener('load', armExitIntent);
    document.removeEventListener("mouseout", handleMouseOut);
  }

  function handleMouseOut(event) {
    if (disposed || !canTrigger || hasShown()) return;
    if (event.clientY <= 20 && event.relatedTarget === null) {
      markShown();
      onExitIntent(event);
      cleanup();
    }
  }

  function armExitIntent() {
    if (disposed) return;
    timer = window.setTimeout(() => {
      canTrigger = true;
    }, delayMs);
  }

  if (document.readyState === 'complete') armExitIntent();
  else window.addEventListener('load', armExitIntent, { once: true });

  document.addEventListener("mouseout", handleMouseOut);
  return cleanup;
}

if (exitPopup) {
  exitPopup.querySelectorAll('[data-exit-close]').forEach((button) => {
    button.addEventListener('click', closeExitPopup);
  });
  exitPopup.addEventListener('click', (event) => {
    if (event.target === exitPopup) closeExitPopup();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeExitPopup();
  });

  const cleanupExitIntent = useExitIntent({
    onExitIntent: () => openExitPopup('exit_intent'),
    delayMs: 5000,
    storageKey: EXIT_INTENT_SESSION_KEY
  });
  window.addEventListener('pagehide', cleanupExitIntent, { once: true });
}

document.querySelectorAll('[data-share]').forEach((button) => {
  const defaultText = button.textContent;
  const showFeedback = (text, state) => {
    button.textContent = text;
    button.dataset.state = state;
    window.clearTimeout(button._shareTimer);
    button._shareTimer = window.setTimeout(() => {
      button.textContent = defaultText;
      delete button.dataset.state;
    }, 2200);
  };

  const copyWithSelection = (url) => {
    const field = document.createElement('textarea');
    field.value = url;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.left = '-9999px';
    field.style.top = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
  };

  const copyLink = async (url) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        showFeedback('Link copiado', 'success');
        return;
      }
    } catch {
      // Some browsers expose clipboard but block it without a permission gesture.
    }

    if (copyWithSelection(url)) {
      showFeedback('Link copiado', 'success');
      return;
    }

    location.href = 'mailto:?subject=' + encodeURIComponent(button.dataset.shareTitle || document.title) + '&body=' + encodeURIComponent(url);
  };

  button.addEventListener('click', async () => {
    const url = new URL(button.dataset.shareUrl || location.href, location.origin).href;
    const title = button.dataset.shareTitle || document.title;
    const text = button.dataset.shareText || '';

    try {
      const mobileShare = typeof navigator.share === 'function' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
      if (mobileShare) {
        await navigator.share({ title, text, url });
        return;
      }
      await copyLink(url);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      try {
        await copyLink(url);
      } catch {
        showFeedback('Não foi possível copiar', 'error');
      }
    }
  });
});

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const posts = [...document.querySelectorAll('[data-category]')];
if (filterButtons.length) {
  filterButtons[0].classList.add('active');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      posts.forEach((post) => {
        post.hidden = filter !== 'Todos posts' && post.dataset.category !== filter;
      });
    });
  });
}
`;

await main();

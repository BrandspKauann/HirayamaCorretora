import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(__dirname, '..');
const outDir = path.join(projectDir, 'site');
const origin = 'https://www.hirayamacorretora.com.br';
const pdfMap = new Map();

function hash(value) {
  return createHash('sha1').update(value).digest('hex').slice(0, 10);
}

function safeName(value) {
  return decodeURIComponent(value || 'file')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64) || 'file';
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36'
    }
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/pdf,*/*',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36'
    }
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

function xmlLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
}

function toRoute(urlOrPath) {
  const parsed = new URL(urlOrPath, origin);
  if (parsed.pathname === '/' || parsed.pathname === '') return '/';
  return decodeURIComponent(parsed.pathname).replace(/\/+$/, '') + '/';
}

function routeFile(route) {
  if (route === '/') return path.join(outDir, 'index.html');
  return path.join(outDir, route.replace(/^\/+/, ''), 'index.html');
}

function localHref(rawPath) {
  const parsed = new URL(rawPath, origin);
  if (parsed.pathname.startsWith('/_files/')) {
    return pdfMap.get(parsed.href) || parsed.href;
  }
  const route = toRoute(parsed.href);
  return route + parsed.search + parsed.hash;
}

function rewriteHtml(html) {
  return html
    .replace(/(<a\b[^>]*?\shref=["'])https:\/\/www\.hirayamacorretora\.com\.br([^"']*)(["'][^>]*>)/gi, (_match, before, href, after) => {
      return `${before}${localHref(href)}${after}`;
    })
    .replace(/(<form\b[^>]*?\saction=["'])https:\/\/www\.hirayamacorretora\.com\.br([^"']*)(["'][^>]*>)/gi, (_match, before, href, after) => {
      return `${before}${localHref(href)}${after}`;
    });
}

async function writePage(route, html) {
  const file = routeFile(route);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html, 'utf8');
}

async function downloadPdfs(htmlPages) {
  const urls = new Set();
  for (const html of htmlPages) {
    for (const match of html.matchAll(/https:\/\/www\.hirayamacorretora\.com\.br\/_files\/ugd\/[^"']+?\.pdf/gi)) {
      urls.add(match[0]);
    }
  }

  await fs.mkdir(path.join(outDir, 'assets', 'docs'), { recursive: true });
  let index = 1;
  for (const url of urls) {
    try {
      const fileName = `${String(index).padStart(2, '0')}-${safeName(path.basename(new URL(url).pathname)).replace(/\.pdf$/i, '')}-${hash(url)}.pdf`;
      const local = `/assets/docs/${fileName}`;
      await fs.writeFile(path.join(outDir, 'assets', 'docs', fileName), await fetchBuffer(url));
      pdfMap.set(url, local);
      index += 1;
    } catch (error) {
      console.warn(`PDF kept remote: ${url} (${error.message})`);
      pdfMap.set(url, url);
    }
  }
}

async function main() {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const sitemapIndex = await fetchText(`${origin}/sitemap.xml`);
  const sitemapUrls = xmlLocs(sitemapIndex);
  const pageUrls = [];

  for (const sitemapUrl of sitemapUrls) {
    const xml = await fetchText(sitemapUrl);
    pageUrls.push(...xmlLocs(xml));
  }

  if (!pageUrls.includes(origin)) pageUrls.push(origin);
  const uniquePageUrls = [...new Set(pageUrls)];
  console.log(`Fetching ${uniquePageUrls.length} Wix pages...`);

  const htmlByUrl = new Map();
  for (const url of uniquePageUrls) {
    console.log(url);
    htmlByUrl.set(url, await fetchText(url));
  }

  await downloadPdfs([...htmlByUrl.values()]);

  for (const [url, html] of htmlByUrl.entries()) {
    await writePage(toRoute(url), rewriteHtml(html));
  }

  await fs.writeFile(path.join(outDir, 'sitemap.xml'), sitemapIndex, 'utf8');
  try {
    await fs.writeFile(path.join(outDir, 'robots.txt'), await fetchText(`${origin}/robots.txt`), 'utf8');
  } catch {
    await fs.writeFile(path.join(outDir, 'robots.txt'), 'User-agent: *\nAllow: /\n', 'utf8');
  }

  await fs.writeFile(path.join(outDir, '404.html'), rewriteHtml(await fetchText(origin)), 'utf8');
  console.log(`Exact Wix mirror generated in ${outDir}`);
}

await main();

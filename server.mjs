import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'site');
const port = Number(process.env.PORT || 4177);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  return path.join(root, normalized);
}

async function resolveFile(requestPath) {
  let file = safePath(requestPath);
  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      file = path.join(file, 'index.html');
    }
  } catch {
    file = path.join(file, 'index.html');
  }

  try {
    const info = await stat(file);
    if (info.isFile()) return file;
  } catch {
    return path.join(root, '404.html');
  }

  return path.join(root, '404.html');
}

createServer(async (req, res) => {
  try {
    const file = await resolveFile(req.url || '/');
    const ext = path.extname(file).toLowerCase();
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    createReadStream(file).pipe(res);
  } catch (error) {
    res.statusCode = 500;
    res.end(`Server error: ${error.message}`);
  }
}).listen(port, () => {
  console.log(`Hirayama clone running at http://localhost:${port}`);
});

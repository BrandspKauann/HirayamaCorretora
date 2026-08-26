import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(projectDir, 'content');
const scheduledPath = path.join(contentDir, 'scheduled-posts.json');
const publishedPath = path.join(contentDir, 'published-scheduled-posts.json');
const scheduledAssetsDir = path.join(contentDir, 'scheduled-assets', 'blog');
const publishedAssetsDir = path.join(contentDir, 'published-assets', 'blog');
const now = process.env.PUBLISH_NOW ? new Date(process.env.PUBLISH_NOW) : new Date();

if (Number.isNaN(now.getTime())) throw new Error('PUBLISH_NOW must be a valid ISO date.');
const scheduled = JSON.parse(await fs.readFile(scheduledPath, 'utf8'));
const published = JSON.parse(await fs.readFile(publishedPath, 'utf8'));
const nextPost = scheduled
  .filter((post) => post.status === 'scheduled' && new Date(post.publishAt) <= now)
  .sort((a, b) => new Date(a.publishAt) - new Date(b.publishAt))[0];

if (!nextPost) {
  console.log('No scheduled posts are due.');
  process.exit(0);
}

const sourceImage = path.join(scheduledAssetsDir, nextPost.image);
const publishedImage = path.join(publishedAssetsDir, nextPost.image);
await fs.access(sourceImage);
await fs.mkdir(publishedAssetsDir, { recursive: true });
await fs.copyFile(sourceImage, publishedImage);

nextPost.status = 'published';
nextPost.publishedAt = now.toISOString();
published.unshift(nextPost);
await fs.writeFile(scheduledPath, `${JSON.stringify(scheduled, null, 2)}\n`);
await fs.writeFile(publishedPath, `${JSON.stringify(published, null, 2)}\n`);
console.log(`Published scheduled post: ${nextPost.slug}`);

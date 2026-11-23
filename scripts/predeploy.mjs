import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const findPlaceholders = (html) => [...html.matchAll(/TODO\(Quan\)[^<"]*|todo-quan/g)].map((m) => m[0]);
// LinkedIn answers scripted requests with 999 or resets them, so it can never pass this check.
export const isCheckable = (url) => !/(^|\.)linkedin\.com$/.test(new URL(url).hostname);
export const extractRefs = (html) => [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));

async function reachable(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(10_000) });
      if (res.status < 400) return true;
    } catch {
      /* try next method */
    }
  }
  return false;
}

async function main() {
  const dist = fileURLToPath(new URL('../dist/', import.meta.url));
  const pages = walk(dist).filter((f) => f.endsWith('.html'));
  const problems = [];
  const external = new Set();

  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    const page = file.slice(dist.length);
    for (const p of new Set(findPlaceholders(html))) problems.push(`placeholder in ${page}: ${p}`);
    for (const ref of extractRefs(html)) {
      if (ref.startsWith('mailto:') || ref.startsWith('#') || ref.startsWith('data:')) continue;
      if (/^https?:\/\//.test(ref)) {
        if (!ref.includes('todo-quan') && isCheckable(ref)) external.add(ref);
      } else if (!ref.startsWith('/_vercel/')) {
        const path = join(dist, ref.split(/[?#]/)[0]);
        if (!existsSync(path) && !existsSync(join(path, 'index.html'))) problems.push(`missing file in ${page}: ${ref}`);
      }
    }
  }
  const checks = await Promise.all([...external].map(async (u) => [u, await reachable(u)]));
  for (const [u, ok] of checks) if (!ok) problems.push(`link not reachable: ${u}`);

  if (problems.length) {
    console.error(`\nNot ready to deploy (${problems.length}):\n` + problems.map((p) => `  - ${p}`).join('\n'));
    process.exit(1);
  }
  console.log(`\nReady: ${pages.length} pages, ${external.size} external links checked.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();

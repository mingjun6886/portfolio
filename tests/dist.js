import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

export const readDist = (rel) => readFileSync(join(DIST, rel), 'utf8');
export const distExists = (rel) => existsSync(join(DIST, rel));

export function allDistHtml(dir = '') {
  return readdirSync(join(DIST, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? allDistHtml(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [],
  );
}

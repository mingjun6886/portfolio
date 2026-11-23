import test from 'node:test';
import assert from 'node:assert/strict';
import { readDist, allDistHtml } from './dist.js';

test('head is complete', () => {
  const html = readDist('index.html');
  assert.match(html, /<html lang="en"/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /<meta name="description" content="Minh Quan Nguyen — Cloud &amp; ML Engineer/);
  assert.match(html, /src="\/_vercel\/insights\/script.js"/);
});

test('head has absolute Open Graph URLs', () => {
  const html = readDist('index.html');
  assert.match(html, /property="og:image" content="https:\/\/[^"]+\/og\.png"/);
  assert.match(html, /property="og:url" content="https:\/\/[^"]+"/);
  assert.match(html, /property="og:title"/);
});

test('never calls Quan a software engineer', () => {
  for (const f of allDistHtml()) assert.doesNotMatch(readDist(f), /software engineer/i, f);
});

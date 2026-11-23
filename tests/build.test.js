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

import { distExists } from './dist.js';

test('three featured projects in order', () => {
  const html = readDist('index.html');
  const pos = ['WildLens', 'FIREBREAK', 'CloudEco'].map((t) => html.indexOf(t));
  assert.ok(pos.every((i) => i > 0) && pos[0] < pos[1] && pos[1] < pos[2]);
});
test('hero shows photo or initials, intro and actions', () => {
  const html = readDist('index.html');
  assert.match(html, /Hi, I&#39;m Quan\.|Hi, I'm Quan\./);
  assert.match(html, /cloud and ML engineer/);
  assert.match(html, /<a(?=[^>]*href="\/cv\.pdf")(?=[^>]*\bdownload\b)[^>]*>/);
  assert.match(html, /href="https:\/\/github\.com\/mingjun6886"/);
  assert.match(html, /class="[^"]*initials/);
  assert.doesNotMatch(html, /Work rights/i);
});
test('contact keeps a mailto fallback', () => {
  assert.match(readDist('index.html'), /href="mailto:minhquan\.nguyen1202@gmail\.com"/);
});
test('grid: filters, tiles, links follow content', () => {
  const html = readDist('index.html');
  assert.match(html, /aria-pressed="true"[^>]*>All</);
  for (const t of ['Cloud', 'AI/ML', 'Planning']) assert.match(html, new RegExp(`aria-pressed="false"[^>]*>${t.replace('/', '\\/')}<`));
  assert.match(html, /href="\/projects\/too-many-chefs\/"/);
  assert.doesNotMatch(html, /href="\/projects\/aussie-ecolens\/"/);
});
test('no tile is hidden in static HTML', () => {
  assert.doesNotMatch(readDist('index.html'), /data-tags="[^"]*"[^>]*\shidden/);
});
test('private repos are never linked', () => {
  const html = readDist('index.html');
  for (const bad of ['fit5222-student-repositories', 'too-many-chefs-mquannguyen', 'FIT5225_Assignment2_Group132']) assert.ok(!html.includes(bad), bad);
});

test('detail pages exist only for entries with a body', () => {
  for (const id of ['wildlens', 'firebreak', 'cloudeco', 'too-many-chefs', 'piglet']) assert.ok(distExists(`projects/${id}/index.html`), id);
  assert.equal(distExists('projects/aussie-ecolens/index.html'), false);
});
test('team project states size and role', () => {
  const html = readDist('projects/firebreak/index.html');
  assert.match(html, /Team of 5/);
  assert.match(html, /voice assistant/i);
});
test('bare project renders without empty boxes', () => {
  const html = readDist('projects/too-many-chefs/index.html');
  assert.doesNotMatch(html, /<img(?![^>]*src="[^"]+")/);
  assert.doesNotMatch(html, /class="metrics"/);
  assert.doesNotMatch(html, /github\.com\/[^"\/]+\/[^"]+/);
});
test('wildlens links its live demo and walkthrough', () => {
  const html = readDist('projects/wildlens/index.html');
  assert.match(html, /d1y0xvoewbydft\.cloudfront\.net/);
  assert.match(html, /diagrams\/pipeline\.html/);
});

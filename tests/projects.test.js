import test from 'node:test';
import assert from 'node:assert/strict';
import { teamLabel, kicker, featuredProjects, otherProjects, hasDetailPage, visibleLinks, filterTags } from '../src/lib/projects.js';

const p = (id, data, body = '') => ({ id, body, data: { title: id, team_size: 1, tags: ['Cloud'], links: {}, code_public: true, featured: false, order: 100, ...data } });

test('teamLabel and kicker', () => {
  assert.equal(teamLabel({ team_size: 1 }), 'Solo');
  assert.equal(kicker({ course: 'FIT5120', team_size: 5 }), 'FIT5120 · Team of 5');
  assert.equal(kicker({ team_size: 1 }), 'Solo');
});
test('featured first by order, others exclude featured', () => {
  const list = [p('c', { featured: true, order: 3 }), p('a', { featured: true, order: 1 }), p('x', { order: 20 }), p('w', { order: 10 })];
  assert.deepEqual(featuredProjects(list).map((e) => e.id), ['a', 'c']);
  assert.deepEqual(otherProjects(list).map((e) => e.id), ['w', 'x']);
});
test('detail page only with a body', () => {
  assert.equal(hasDetailPage(p('a', {}, '## The problem\nText')), true);
  assert.equal(hasDetailPage(p('b', {}, '  \n ')), false);
});
test('private code hides the repo link only', () => {
  assert.deepEqual(visibleLinks({ code_public: false, links: { github: 'https://g', demo: 'https://d' } }), { demo: 'https://d' });
  assert.deepEqual(visibleLinks({ code_public: true, links: { github: 'https://g' } }), { github: 'https://g' });
});
test('filter tags keep canonical order', () => {
  assert.deepEqual(filterTags([p('a', { tags: ['Planning', 'Cloud'] }), p('b', { tags: ['Cloud'] })]), ['Cloud', 'Planning']);
});

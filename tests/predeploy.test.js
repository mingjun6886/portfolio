import test from 'node:test';
import assert from 'node:assert/strict';
import { findPlaceholders, extractRefs } from '../scripts/predeploy.mjs';

test('finds placeholders', () => {
  assert.deepEqual(findPlaceholders('<p>TODO(Quan): degree name</p><a href="https://todo-quan.vercel.app">'), ['TODO(Quan): degree name', 'todo-quan']);
  assert.deepEqual(findPlaceholders('<p>done</p>'), []);
});
test('extracts refs', () => {
  assert.deepEqual(extractRefs('<a href="/cv.pdf"></a><img src="/p.jpg">'), ['/cv.pdf', '/p.jpg']);
});

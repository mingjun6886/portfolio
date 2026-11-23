import test from 'node:test';
import assert from 'node:assert/strict';
import { findPlaceholders, extractRefs, isCheckable } from '../scripts/predeploy.mjs';

test('finds placeholders', () => {
  assert.deepEqual(findPlaceholders('<p>TODO(Quan): degree name</p><a href="https://todo-quan.vercel.app">'), ['TODO(Quan): degree name', 'todo-quan']);
  assert.deepEqual(findPlaceholders('<p>done</p>'), []);
});
test('extracts refs', () => {
  assert.deepEqual(extractRefs('<a href="/cv.pdf"></a><img src="/p.jpg">'), ['/cv.pdf', '/p.jpg']);
});
test('skips hosts that block scripted requests', () => {
  assert.equal(isCheckable('https://www.linkedin.com/in/x'), false);
  assert.equal(isCheckable('https://github.com/x'), true);
});

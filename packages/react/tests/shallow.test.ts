import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { shallow } from '../src/utils/shallow';

test('uses Object.is for primitive values', () => {
  assert.equal(shallow(NaN, NaN), true);
  assert.equal(shallow(0, -0), false);
  assert.equal(shallow(null, null), true);
  assert.equal(shallow<unknown>(null, {}), false);
  assert.equal(shallow<unknown>(1, '1'), false);
});

test('compares node selector results by their immediate values', () => {
  const node = { id: 'node' };
  const internals = { positionAbsolute: { x: 0, y: 0 } };
  const selection = { node, internals, isParent: false };
  assert.equal(shallow(selection, { ...selection }), true);
  assert.equal(shallow(selection, { ...selection, isParent: true }), false);
  assert.equal(shallow(selection, { ...selection, node: { ...node } }), false);
  assert.equal(shallow(selection, { ...selection, internals: { ...internals } }), false);
});

test('detects changes in visible ids, including their order and count', () => {
  assert.equal(shallow(['a', 'b'], ['a', 'b']), true);
  assert.equal(shallow(['a', 'b'], ['b', 'a']), false);
  assert.equal(shallow(['a', 'b'], ['a']), false);
});

test('compares own keys regardless of insertion order', () => {
  assert.equal(shallow({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
  assert.equal(shallow({ a: undefined }, { b: undefined }), false);
  assert.equal(shallow({ a: undefined }, {}), false);
  assert.equal(shallow(Object.create({ a: 1 }), {}), true);
  assert.equal(shallow(Object.assign(Object.create(null), { a: 1 }), { a: 1 }), true);
});

test('compares Map membership and shallow values', () => {
  const value = {};
  assert.equal(shallow(new Map([['a', value]]), new Map([['a', value]])), true);
  assert.equal(shallow(new Map([['a', {}]]), new Map([['a', {}]])), false);
  assert.equal(shallow(new Map([['a', undefined]]), new Map([['b', undefined]])), false);
  assert.equal(shallow(new Map([['a', 1]]), new Map()), false);
  assert.equal(shallow<unknown>(new Map(), {}), false);
  assert.equal(shallow<unknown>({}, new Map()), false);
});

test('compares Set membership regardless of insertion order', () => {
  assert.equal(shallow(new Set(['a', 'b']), new Set(['b', 'a'])), true);
  assert.equal(shallow(new Set(['a']), new Set(['b'])), false);
  assert.equal(shallow(new Set(['a']), new Set()), false);
  assert.equal(shallow<unknown>(new Set(), {}), false);
  assert.equal(shallow<unknown>({}, new Set()), false);
});

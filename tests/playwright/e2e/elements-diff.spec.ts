import { test, expect } from '@playwright/test';
import type { Node, Edge } from '../../../packages/react/src/types';
import type { NodeLookup } from '../../../packages/system/src/types';
import { adoptUserNodes } from '../../../packages/system/src/utils/store';
import { getElementsDiffChanges, applyNodeChanges, applyEdgeChanges } from '../../../packages/react/src/utils/changes';

const nodes: Node[] = ['a', 'b', 'c'].map((id, index) => ({
  id,
  position: { x: index * 100, y: 0 },
  data: { label: id },
  selected: id === 'a',
}));

function diff(next: Node[], previous = nodes) {
  const lookup: NodeLookup = new Map();
  adoptUserNodes(previous, lookup, new Map());
  return getElementsDiffChanges({ items: next, lookup });
}

test.describe('getElementsDiffChanges', () => {
  for (const order of [
    [1, 0, 2],
    [2, 0, 1],
    [1, 2, 0],
    [2, 1, 0],
  ]) {
    test(`preserves the requested order ${order.join(',')} with unchanged objects`, () => {
      const next = order.map((index) => nodes[index]);
      expect(applyNodeChanges(diff(next), nodes)).toEqual(next);
    });
  }

  test('combines reordering with additions, deletions and changed node data', () => {
    const next = [
      { ...nodes[0], id: 'new' },
      nodes[2],
      { ...nodes[0], data: { label: 'updated' }, position: { x: 50, y: 50 } },
    ];
    expect(applyNodeChanges(diff(next), nodes)).toEqual(next);
    expect(nodes.map((node) => node.id)).toEqual(['a', 'b', 'c']);
    expect(nodes[0].data.label).toBe('a');
  });

  test('does not produce changes for an unchanged array', () => {
    expect(diff([...nodes])).toEqual([]);
  });

  test('does not move retained nodes when inserting or deleting other nodes', () => {
    const added = { ...nodes[0], id: 'new' };
    expect(diff([added, ...nodes])).toEqual([{ type: 'add', item: added, index: 0 }]);
    expect(diff([nodes[0], nodes[2]])).toEqual([{ type: 'remove', id: 'b' }]);
  });

  test('keeps same-order updates as replacements', () => {
    const updated = { ...nodes[1], selected: true };
    expect(diff([nodes[0], updated, nodes[2]])).toEqual([{ type: 'replace', id: 'b', item: updated }]);
  });

  test('reorders edges without losing their data', () => {
    const edges: Edge[] = [
      { id: 'ab', source: 'a', target: 'b', selected: true },
      { id: 'bc', source: 'b', target: 'c' },
      { id: 'ca', source: 'c', target: 'a' },
    ];
    const next = [edges[2], { ...edges[0], label: 'updated' }];
    const changes = getElementsDiffChanges({ items: next, lookup: new Map(edges.map((edge) => [edge.id, edge])) });
    expect(applyEdgeChanges(changes, edges)).toEqual(next);
  });
});

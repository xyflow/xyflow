import { describe, expect, it, vi } from 'vitest';

import type { EdgeBase, NodeBase } from '../types';
import { getElementsToRemove } from './graph';

const parent: NodeBase = { id: 'parent', data: {}, position: { x: 0, y: 0 } };
const child: NodeBase = { ...parent, id: 'child', parentId: 'parent' };
const grandchild: NodeBase = { ...parent, id: 'grandchild', parentId: 'child' };
const edge: EdgeBase = { id: 'child-grandchild', source: 'child', target: 'grandchild' };

describe('getElementsToRemove', () => {
  it.each([
    [parent, grandchild, child],
    [child, parent, grandchild],
  ])('removes the full subtree in input order: %j, %j, %j', async (...nodes) => {
    const result = await getElementsToRemove({ nodesToRemove: [parent], edgesToRemove: [], nodes, edges: [edge] });
    expect(result.nodes).toEqual(nodes);
    expect(result.edges).toEqual([edge]);
  });

  it('preserves protected subtrees but allows explicitly selected descendants to be removed', async () => {
    const nodes = [grandchild, { ...child, deletable: false }, parent];
    const result = await getElementsToRemove({ nodesToRemove: [parent], edgesToRemove: [], nodes, edges: [edge] });
    expect(result.nodes).toEqual([parent]);
    expect(result.edges).toEqual([]);

    const explicit = await getElementsToRemove({
      nodesToRemove: [parent, grandchild],
      edgesToRemove: [],
      nodes,
      edges: [edge],
    });
    expect(explicit.nodes).toEqual([grandchild, parent]);
    expect(explicit.edges).toEqual([edge]);
  });

  it('passes the complete unordered subtree to onBeforeDelete and respects a veto', async () => {
    const nodes = [grandchild, child, parent];
    const onBeforeDelete = vi.fn().mockResolvedValue(false);
    const result = await getElementsToRemove({
      nodesToRemove: [parent],
      edgesToRemove: [],
      nodes,
      edges: [edge],
      onBeforeDelete,
    });
    expect(onBeforeDelete).toHaveBeenCalledWith({ nodes, edges: [edge] });
    expect(result).toEqual({ nodes: [], edges: [] });
  });
});

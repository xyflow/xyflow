import { describe, expect, it, vi } from 'vitest';

import type { EdgeBase, InternalNodeBase, NodeBase, PanZoomInstance } from '../types';
import { fitViewport, getElementsToRemove } from './graph';

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

describe('fitViewport', () => {
  function createInternalNode(id: string, x: number, y: number, hidden = false): InternalNodeBase {
    return {
      id,
      data: {},
      position: { x, y },
      hidden,
      measured: { width: 100, height: 50 },
      internals: { positionAbsolute: { x, y }, z: 0, isParent: false, userNode: { id, data: {}, position: { x, y } } },
    };
  }

  function setup() {
    const nodes = new Map<string, InternalNodeBase>([
      ['a', createInternalNode('a', 0, 0)],
      ['b', createInternalNode('b', 400, 300)],
      ['hidden', createInternalNode('hidden', 800, 600, true)],
    ]);
    const setViewport = vi.fn().mockResolvedValue(true);
    const panZoom = { setViewport } as unknown as PanZoomInstance;

    // `nodes` is read from the fit view options at runtime (React Flow passes its `fitViewOptions`)
    const fit = (options: { nodes: { id: string }[] }) =>
      fitViewport(
        { nodes, width: 1000, height: 800, panZoom, minZoom: 0.5, maxZoom: 2 },
        options as Parameters<typeof fitViewport>[1]
      );

    return { fit, setViewport };
  }

  it('fits the given nodes', async () => {
    const { fit, setViewport } = setup();

    await expect(fit({ nodes: [{ id: 'a' }] })).resolves.toBe(true);
    expect(setViewport).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['an empty nodes array', []],
    ['ids that do not exist', [{ id: 'missing' }]],
    ['hidden nodes only', [{ id: 'hidden' }]],
  ])('keeps the current viewport when %s is passed', async (_, nodesToFit) => {
    const { fit, setViewport } = setup();

    await expect(fit({ nodes: nodesToFit })).resolves.toBe(true);
    expect(setViewport).not.toHaveBeenCalled();
  });
});

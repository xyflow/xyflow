import { adoptUserNodes, calculateNodePosition, type NodeLookup, type ParentLookup } from '@xyflow/system';
import type { Node } from '@xyflow/react';

describe('calculateNodePosition', () => {
  it("clamps a child with extent 'parent' to a parent that has an intrinsic size but is not measured yet", () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();

    const nodes: Node[] = [
      {
        id: 'parent',
        data: { label: 'parent' },
        position: { x: 0, y: 0 },
        // intrinsic size, but no measured dimensions yet (e.g. before measuring / SSR)
        initialWidth: 200,
        initialHeight: 100,
      },
      {
        id: 'child',
        data: { label: 'child' },
        position: { x: 0, y: 0 },
        measured: { width: 50, height: 50 },
        parentId: 'parent',
        extent: 'parent',
      },
    ];

    adoptUserNodes(nodes, nodeLookup, parentLookup);

    const { positionAbsolute } = calculateNodePosition({
      nodeId: 'child',
      nextPosition: { x: 500, y: 500 },
      nodeLookup,
    });

    // The child must stay inside the parent: max x = 200 - 50, max y = 100 - 50.
    // Before the fix the parent's unmeasured size was ignored and the child
    // escaped to { x: 500, y: 500 }.
    expect(positionAbsolute.x).to.equal(150);
    expect(positionAbsolute.y).to.equal(50);
  });
});

export {};

import {
  updateNodeInternals,
  adoptUserNodes,
  type InternalNodeUpdate,
  type NodeLookup,
  type ParentLookup,
} from '@xyflow/system';
import type { Node } from '@xyflow/react';

// Regression test for https://github.com/xyflow/xyflow/issues/5835
// When a node references a `parentId` that is absent from `nodeLookup` (for
// example the parent was removed while the child's ResizeObserver still fires),
// `updateNodeInternals` used to call `clampPositionToParent(..., nodeLookup.get(parentId)!)`
// with an `undefined` parent and crash with
// `TypeError: Cannot read properties of undefined (reading 'measured')`.
describe('updateNodeInternals with a missing parent', () => {
  it('does not crash when a node parent is absent from nodeLookup', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();

    // A child whose parent ("missing-parent") is never added to the lookup.
    const child: Node = {
      id: 'child',
      data: { label: 'child' },
      position: { x: 0, y: 0 },
      parentId: 'missing-parent',
      extent: 'parent',
      measured: { width: 50, height: 50 },
    };
    adoptUserNodes([child], nodeLookup, parentLookup);

    // Minimal flow DOM so `updateNodeInternals` does not bail out early on the
    // missing `.xyflow__viewport` and reads a real zoom from the transform.
    const domNode = document.createElement('div');
    const viewport = document.createElement('div');
    viewport.className = 'xyflow__viewport';
    viewport.style.transform = 'translate(0px, 0px) scale(1)';
    domNode.appendChild(viewport);
    document.body.appendChild(domNode);

    const nodeElement = document.createElement('div');
    nodeElement.style.width = '50px';
    nodeElement.style.height = '50px';
    document.body.appendChild(nodeElement);

    const updates = new Map<string, InternalNodeUpdate>([
      ['child', { id: 'child', nodeElement, force: true }],
    ]);

    expect(() =>
      updateNodeInternals(updates, nodeLookup, parentLookup, domNode, [0, 0])
    ).to.not.throw();

    domNode.remove();
    nodeElement.remove();
  });
});

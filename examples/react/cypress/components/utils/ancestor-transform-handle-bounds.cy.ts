import {
  adoptUserNodes,
  updateNodeInternals,
  type InternalNodeUpdate,
  type NodeLookup,
  type ParentLookup,
} from '@xyflow/system';
import type { Node } from '@xyflow/react';

// Regression test for https://github.com/xyflow/xyflow/issues/6023
// Handle rectangles are measured in screen space, so ancestor transforms must
// be included when converting their offsets back into flow coordinates.
describe('updateNodeInternals with an ancestor transform', () => {
  it('normalizes source and target handle offsets by the ancestor scale', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();
    const node: Node = {
      id: 'node',
      data: { label: 'node' },
      position: { x: 0, y: 0 },
      measured: { width: 100, height: 40 },
    };
    adoptUserNodes([node], nodeLookup, parentLookup);

    const domNode = document.createElement('div');
    const viewport = document.createElement('div');
    viewport.className = 'xyflow__viewport';
    viewport.style.transform = 'translate(0px, 0px) scale(1)';
    domNode.appendChild(viewport);
    document.body.appendChild(domNode);

    // The ancestor is scaled to 2x: the DOM node's layout width remains 100,
    // while its screen-space bounding rectangle is 200px wide.
    Object.defineProperty(domNode, 'offsetWidth', { value: 100 });
    Object.defineProperty(domNode, 'getBoundingClientRect', {
      value: () => new DOMRect(0, 0, 200, 80),
    });

    const nodeElement = document.createElement('div');
    Object.defineProperty(nodeElement, 'offsetWidth', { value: 100 });
    Object.defineProperty(nodeElement, 'offsetHeight', { value: 40 });
    Object.defineProperty(nodeElement, 'getBoundingClientRect', {
      value: () => new DOMRect(100, 50, 100, 40),
    });

    for (const type of ['source', 'target']) {
      const handle = document.createElement('div');
      handle.className = type;
      handle.setAttribute('data-handleid', `${type}-handle`);
      handle.setAttribute('data-handlepos', 'right');
      Object.defineProperty(handle, 'offsetWidth', { value: 10 });
      Object.defineProperty(handle, 'offsetHeight', { value: 10 });
      Object.defineProperty(handle, 'getBoundingClientRect', {
        value: () => new DOMRect(130, 60, 10, 10),
      });
      nodeElement.appendChild(handle);
    }
    domNode.appendChild(nodeElement);

    const updates = new Map<string, InternalNodeUpdate>([
      ['node', { id: 'node', nodeElement, force: true }],
    ]);

    updateNodeInternals(updates, nodeLookup, parentLookup, domNode, [0, 0]);

    const handleBounds = nodeLookup.get('node')?.internals.handleBounds;
    expect(handleBounds?.source?.[0].x).to.equal(15);
    expect(handleBounds?.target?.[0].x).to.equal(15);

    domNode.remove();
  });
});

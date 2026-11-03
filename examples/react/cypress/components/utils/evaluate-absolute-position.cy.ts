import {
  adoptUserNodes,
  evaluateAbsolutePosition,
  type NodeLookup,
  type ParentLookup,
} from '@xyflow/system';
import type { Node, NodeOrigin } from '@xyflow/react';

const getAbsolutePosition = (nodes: Node[], nodeOrigin: NodeOrigin, nodeId: string) => {
  const nodeLookup: NodeLookup = new Map();
  const parentLookup: ParentLookup = new Map();

  adoptUserNodes(nodes, nodeLookup, parentLookup, { nodeOrigin });

  const node = nodeLookup.get(nodeId);

  return evaluateAbsolutePosition(
    node!.position,
    node!.measured,
    node!.parentId!,
    nodeLookup,
    node!.origin ?? nodeOrigin
  );
};

describe('evaluateAbsolutePosition Testing', () => {
  it('returns the same position as the internal node for a child with its own origin', () => {
    const nodeOrigin: NodeOrigin = [0, 0];

    const userParentNode: Node = {
      id: '1',
      data: { label: 'parent' },
      position: { x: 0, y: 0 },
      measured: { width: 100, height: 100 },
    };

    const userChildNode: Node = {
      id: '2',
      data: { label: 'child' },
      position: { x: 100, y: 100 },
      measured: { width: 100, height: 100 },
      parentId: '1',
      origin: [0.5, 0.5],
    };

    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();
    adoptUserNodes([userParentNode, userChildNode], nodeLookup, parentLookup, { nodeOrigin });

    const internalChildNode = nodeLookup.get('2');
    const position = getAbsolutePosition([userParentNode, userChildNode], nodeOrigin, '2');

    expect(position.x).to.equal(internalChildNode?.internals.positionAbsolute.x);
    expect(position.y).to.equal(internalChildNode?.internals.positionAbsolute.y);
    expect(position.x).to.equal(50);
    expect(position.y).to.equal(50);
  });

  it('returns the same position as the internal node for a child of a parent with its own origin', () => {
    const nodeOrigin: NodeOrigin = [0.5, 0.5];

    const userParentNode: Node = {
      id: '1',
      data: { label: 'parent' },
      position: { x: 0, y: 0 },
      measured: { width: 100, height: 100 },
      origin: [0, 0],
    };

    const userChildNode: Node = {
      id: '2',
      data: { label: 'child' },
      position: { x: 100, y: 100 },
      measured: { width: 100, height: 100 },
      parentId: '1',
    };

    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();
    adoptUserNodes([userParentNode, userChildNode], nodeLookup, parentLookup, { nodeOrigin });

    const internalChildNode = nodeLookup.get('2');
    const position = getAbsolutePosition([userParentNode, userChildNode], nodeOrigin, '2');

    expect(position.x).to.equal(internalChildNode?.internals.positionAbsolute.x);
    expect(position.y).to.equal(internalChildNode?.internals.positionAbsolute.y);
    expect(position.x).to.equal(50);
    expect(position.y).to.equal(50);
  });
});

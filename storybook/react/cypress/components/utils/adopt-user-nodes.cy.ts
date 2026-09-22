import { adoptUserNodes, type NodeLookup, type ParentLookup } from '@xyflow/system';
import type { CoordinateExtent, Node, NodeOrigin } from '@xyflow/react';

describe('adoptUserNodes Testing', () => {
  it('builds node lookup', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();

    const userNode: Node = {
      id: '1',
      data: { label: 'node' },
      position: { x: 250, y: 5 },
      measured: { width: 100, height: 50 },
    };

    adoptUserNodes([userNode], nodeLookup, parentLookup);
    const internalNode = nodeLookup.get('1');

    expect(nodeLookup.size).to.equal(1);
    expect(internalNode).to.have.property('internals');
  });

  it('calculates positionAbsolute with nodeOrigin', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();

    const userNode: Node = {
      id: '1',
      data: { label: 'node' },
      position: { x: 250, y: 5 },
      measured: { width: 100, height: 50 },
    };

    adoptUserNodes([userNode], nodeLookup, parentLookup, {
      nodeOrigin: [0.5, 0.5],
    });

    const internalNode = nodeLookup.get('1');

    expect(internalNode?.internals.positionAbsolute.x).to.equal(
      userNode.position.x - (userNode.measured?.width ?? 0) / 2
    );
    expect(internalNode?.internals.positionAbsolute.y).to.equal(
      userNode.position.y - (userNode.measured?.height ?? 0) / 2
    );
  });

  it('calculates positionAbsolute with nodeExtent', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();
    const nodeExtent: CoordinateExtent = [
      [0, 0],
      [100, 100],
    ];

    const userNode: Node = {
      id: '1',
      data: { label: 'node' },
      position: { x: 500, y: 500 },
      measured: { width: 50, height: 25 },
    };

    adoptUserNodes([userNode], nodeLookup, parentLookup, {
      nodeExtent,
    });

    const internalNode = nodeLookup.get('1');

    expect(internalNode?.internals.positionAbsolute.x).to.equal(nodeExtent[1][0] - userNode.measured!.width!);
    expect(internalNode?.internals.positionAbsolute.y).to.equal(nodeExtent[1][1] - userNode.measured!.height!);
  });

  it('calculates positionAbsolute for sub flow', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();

    const userParentNode: Node = {
      id: '1',
      data: { label: 'node' },
      position: { x: 100, y: 100 },
      measured: { width: 100, height: 50 },
    };

    const userChildNode: Node = {
      id: '2',
      data: { label: 'child' },
      position: { x: 0, y: 0 },
      measured: { width: 100, height: 50 },
      parentId: '1',
    };

    adoptUserNodes([userParentNode, userChildNode], nodeLookup, parentLookup);

    const internalChildNode = nodeLookup.get('2');

    expect(nodeLookup.size).to.equal(2);

    expect(internalChildNode?.internals.positionAbsolute.x).to.equal(
      userChildNode.position.x + userParentNode.position.x
    );
    expect(internalChildNode?.internals.positionAbsolute.y).to.equal(
      userChildNode.position.y + userParentNode.position.y
    );
  });

  it('calculates positionAbsolute for sub flow with nodeOrigin', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();
    const nodeOrigin: NodeOrigin = [0.5, 0.5];

    const userParentNode: Node = {
      id: '1',
      data: { label: 'node' },
      position: { x: 100, y: 100 },
      measured: { width: 100, height: 50 },
    };

    const userChildNode: Node = {
      id: '2',
      data: { label: 'child' },
      position: { x: 0, y: 0 },
      measured: { width: 100, height: 50 },
      parentId: '1',
    };

    adoptUserNodes([userParentNode, userChildNode], nodeLookup, parentLookup, {
      nodeOrigin,
    });

    const internalParentNode = nodeLookup.get('1');
    const internalChildNode = nodeLookup.get('2');

    const expectedParentX = userParentNode.position.x - userParentNode.measured!.width! * nodeOrigin[0];
    const expectedParentY = userParentNode.position.y - userParentNode.measured!.height! * nodeOrigin[1];

    expect(internalParentNode?.internals.positionAbsolute.x).to.equal(expectedParentX);
    expect(internalParentNode?.internals.positionAbsolute.y).to.equal(expectedParentY);

    const expectedChildX = userChildNode.position.x - userChildNode.measured!.width! * nodeOrigin[0] + expectedParentX;
    const expectedChildY = userChildNode.position.y - userChildNode.measured!.height! * nodeOrigin[1] + expectedParentY;

    expect(internalChildNode?.internals.positionAbsolute.x).to.equal(expectedChildX);
    expect(internalChildNode?.internals.positionAbsolute.y).to.equal(expectedChildY);
  });

  it('calculates positionAbsolute for sub flow with nodeExtent', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();
    const nodeExtent: CoordinateExtent = [
      [0, 0],
      [200, 200],
    ];

    const userParentNodeA: Node = {
      id: 'a',
      data: { label: 'node' },
      position: { x: 500, y: 500 },
      measured: { width: 100, height: 50 },
    };

    const userParentNodeB: Node = {
      id: 'b',
      data: { label: 'node' },
      position: { x: 0, y: 0 },
      measured: { width: 100, height: 50 },
    };

    const userChildNode: Node = {
      id: 'c',
      data: { label: 'child' },
      position: { x: 1000, y: 1000 },
      measured: { width: 100, height: 50 },
      parentId: 'a',
    };

    adoptUserNodes([userParentNodeA, userParentNodeB, userChildNode], nodeLookup, parentLookup, {
      nodeExtent,
    });

    const internalParentNodeA = nodeLookup.get('a');
    const internalParentNodeB = nodeLookup.get('b');

    const internalChildNode = nodeLookup.get('c');

    const expectedParentX = nodeExtent[1][0] - userParentNodeA.measured!.width!;
    const expectedParentY = nodeExtent[1][1] - userParentNodeA.measured!.height!;

    // this node is inside the nodeExtent and should be restricted to it
    expect(internalParentNodeA?.internals.positionAbsolute.x).to.equal(expectedParentX);
    expect(internalParentNodeA?.internals.positionAbsolute.y).to.equal(expectedParentY);

    // this node is inside the nodeExtent and should not be affected by it
    expect(internalParentNodeB?.internals.positionAbsolute.x).to.equal(userParentNodeB.position.x);
    expect(internalParentNodeB?.internals.positionAbsolute.y).to.equal(userParentNodeB.position.y);

    const expectedChildX = nodeExtent[1][0] - userChildNode.measured!.width!;
    const expectedChildY = nodeExtent[1][1] - userChildNode.measured!.height!;

    expect(internalChildNode?.internals.positionAbsolute.x).to.equal(expectedChildX);
    expect(internalChildNode?.internals.positionAbsolute.y).to.equal(expectedChildY);
  });
});

export {};

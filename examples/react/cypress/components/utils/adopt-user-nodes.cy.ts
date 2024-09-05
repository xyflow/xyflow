import { adoptUserNodes } from '@xyflow/system';

import type { Node, NodeLookup, ParentLookup } from '@xyflow/react';

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

    expect(internalNode.internals.positionAbsolute.x).to.equal(userNode.position.x - userNode.measured.width / 2);
    expect(internalNode.internals.positionAbsolute.y).to.equal(userNode.position.y - userNode.measured.height / 2);
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

    const internalParentNode = nodeLookup.get('1');
    const internalChildNode = nodeLookup.get('2');

    expect(nodeLookup.size).to.equal(2);

    expect(internalChildNode.internals.positionAbsolute.x).to.equal(
      userChildNode.position.x + userParentNode.position.x
    );
    expect(internalChildNode.internals.positionAbsolute.y).to.equal(
      userChildNode.position.y + userParentNode.position.y
    );
  });

  it('calculates positionAbsolute for sub flow with nodeOrigin', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();
    const nodeOrigin = [0.5, 0.5];

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

    const expectedParentX = userParentNode.position.x - userParentNode.measured.width * nodeOrigin[0];
    const expectedParentY = userParentNode.position.y - userParentNode.measured.height * nodeOrigin[1];

    expect(internalParentNode.internals.positionAbsolute.x).to.equal(expectedParentX);
    expect(internalParentNode.internals.positionAbsolute.y).to.equal(expectedParentY);

    const expectedChildX = userChildNode.position.x - userChildNode.measured.width * nodeOrigin[0] + expectedParentX;
    const expectedChildY = userChildNode.position.y - userChildNode.measured.height * nodeOrigin[1] + expectedParentY;

    expect(internalChildNode.internals.positionAbsolute.x).to.equal(expectedChildX);
    expect(internalChildNode.internals.positionAbsolute.y).to.equal(expectedChildY);
  });
});

export {};

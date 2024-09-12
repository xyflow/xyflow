import { adoptUserNodes, getNodesBounds, type NodeLookup, type ParentLookup } from '@xyflow/system';
import type { Node } from '@xyflow/react';

describe('getNodesBounds Testing', () => {
  it('calculates bounds for a node', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();

    const nodes: Node[] = [
      {
        id: '1',
        data: { label: 'node' },
        position: { x: 10, y: 10 },
        measured: { width: 100, height: 50 },
      },
    ];

    adoptUserNodes(nodes, nodeLookup, parentLookup);

    const bounds = getNodesBounds(nodes, { nodeLookup });

    expect(bounds.x).to.equal(10);
    expect(bounds.y).to.equal(10);
    expect(bounds.width).to.equal(100);
    expect(bounds.height).to.equal(50);
  });

  it('calculates bounds for a node (-x, -y)', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();

    const nodes: Node[] = [
      {
        id: '1',
        data: { label: 'node' },
        position: { x: -10, y: -10 },
        measured: { width: 100, height: 50 },
      },
    ];

    adoptUserNodes(nodes, nodeLookup, parentLookup);

    const bounds = getNodesBounds(nodes, { nodeLookup });

    expect(bounds.x).to.equal(-10);
    expect(bounds.y).to.equal(-10);
    expect(bounds.width).to.equal(100);
    expect(bounds.height).to.equal(50);
  });

  it('calculates bounds for multitple nodes', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();

    const nodes: Node[] = [
      {
        id: '1',
        data: { label: 'node' },
        position: { x: -10, y: 10 },
        measured: { width: 100, height: 50 },
      },
      {
        id: '2',
        data: { label: 'node' },
        position: { x: 100, y: 100 },
        measured: { width: 100, height: 50 },
      },
    ];

    adoptUserNodes(nodes, nodeLookup, parentLookup);

    const bounds = getNodesBounds(nodes, { nodeLookup });

    expect(bounds.x).to.equal(-10);
    expect(bounds.y).to.equal(10);
    expect(bounds.width).to.equal(210);
    expect(bounds.height).to.equal(140);
  });

  it('calculates bounds for a node with a child node', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();

    const nodes: Node[] = [
      {
        id: '1',
        data: { label: 'node' },
        position: { x: 10, y: 10 },
        measured: { width: 100, height: 50 },
      },
      {
        id: '2',
        data: { label: 'node' },
        position: { x: 200, y: 100 },
        measured: { width: 100, height: 50 },
        parentId: '1',
      },
      {
        id: '3',
        data: { label: 'node' },
        position: { x: 0, y: 200 },
        measured: { width: 100, height: 50 },
        parentId: '1',
      },
    ];

    adoptUserNodes(nodes, nodeLookup, parentLookup);

    const bounds = getNodesBounds(nodes, { nodeLookup });

    expect(bounds.x).to.equal(10);
    expect(bounds.y).to.equal(10);
    expect(bounds.width).to.equal(300);
    expect(bounds.height).to.equal(250);
  });

  it('calculates bounds for child nodes', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();

    const nodes: Node[] = [
      {
        id: '1',
        data: { label: 'node' },
        position: { x: 10, y: 10 },
        measured: { width: 100, height: 50 },
      },
      {
        id: '2',
        data: { label: 'node' },
        position: { x: 20, y: 20 },
        measured: { width: 100, height: 50 },
        parentId: '1',
      },
      {
        id: '3',
        data: { label: 'node' },
        position: { x: 20, y: 200 },
        measured: { width: 100, height: 50 },
        parentId: '1',
      },
    ];

    adoptUserNodes(nodes, nodeLookup, parentLookup);

    const bounds = getNodesBounds([nodes[1], nodes[2]], { nodeLookup });

    expect(bounds.x).to.equal(30);
    expect(bounds.y).to.equal(30);
    expect(bounds.width).to.equal(100);
    expect(bounds.height).to.equal(230);
  });
});

export {};

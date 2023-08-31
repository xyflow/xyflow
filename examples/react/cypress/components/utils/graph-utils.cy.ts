import { Node, Edge, isNode, isEdge, getOutgoers, getIncomers, addEdge } from '@xyflow/react';

const nodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
];

const edges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-3', source: '2', target: '3' },
];

describe('Graph Utils Testing', () => {
  it('tests isNode function', () => {
    expect(isNode(nodes[0])).to.be.true;
    expect(isNode(edges[0])).to.be.false;
  });

  it('tests isEdge function', () => {
    expect(isEdge(edges[0])).to.be.true;
    expect(isEdge(nodes[0])).to.be.false;
  });

  it('tests getOutgoers function', () => {
    const outgoers = getOutgoers(nodes[0], nodes, edges);

    expect(outgoers.length).to.be.equal(2);

    const noOutgoers = getOutgoers(nodes[2], nodes, edges);
    expect(noOutgoers.length).to.be.equal(0);
  });

  it('tests getIncomers function', () => {
    const incomers = getIncomers(nodes[2], nodes, edges);
    expect(incomers.length).to.be.equal(2);

    const noIncomers = getIncomers(nodes[0], nodes, edges);
    expect(noIncomers.length).to.be.equal(0);
  });

  describe('tests addEdge function', () => {
    it('adds edge', () => {
      const newEdge: Edge = { source: '1', target: '4', id: 'new-edge-1-4' };
      const nextEdges = addEdge(newEdge, edges);

      expect(nextEdges.length).to.be.equal(edges.length + 1);
    });

    it('tries to add existing edge', () => {
      const newEdge: Edge = { source: '2', target: '3', id: 'new-edge-2-3' };
      const nextEdges = addEdge(newEdge, edges);

      expect(nextEdges.length).to.be.equal(edges.length);
    });

    it('tries to add invalid edge', () => {
      // @ts-ignore
      const newEdge: Edge = { nosource: '1', notarget: '3' };

      try {
        addEdge(newEdge, edges);
      } catch (e: any) {
        console.log(e.message);

        expect(e.message).to.be.equal("Can't create edge. An edge needs a source and a target.");
      }
    });
  });
});

export {};

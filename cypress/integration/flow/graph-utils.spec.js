import { isNode, isEdge, getOutgoers, removeElements, addEdge } from '../../../src/utils/graph.ts';

const nodes = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const elements = [...nodes, ...edges];

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
    const outgoers = getOutgoers(nodes[0], elements);
    expect(outgoers.length).to.be.equal(2);

    const noOutgoers = getOutgoers(nodes[1], elements);
    expect(noOutgoers.length).to.be.equal(0);
  });

  describe('tests addEdge function', () => {
    it('adds edge', () => {
      const newEdge = { source: '2', target: '3' };
      const nextElements = addEdge(newEdge, elements);

      expect(nextElements.length).to.be.equal(elements.length + 1);
    });

    it('tries to add invalid edge', () => {
      const newEdge = { nosource: '1', notarget: '3' };

      try {
        addEdge(newEdge, elements);
      } catch (e) {
        console.log(e.message);

        expect(e.message).to.be.equal("Can't create edge. An edge needs a source and a target.");
      }
    });

    it('tries to add edge with id that does not exist', () => {
      const notExistingId = 'does-not-exist';
      const newEdge = { source: notExistingId, target: '3' };

      try {
        addEdge(newEdge, elements);
      } catch (e) {
        console.log(e.message);
        expect(e.message).to.be.equal(`Can't create edge. Node with id=${notExistingId} does not exist.`);
      }
    });
  });

  describe('tests removeElements function', () => {
    it('removes a node', () => {
      const nextElements = removeElements([nodes[0]], elements);

      const nextNodes = nextElements.filter((e) => isNode(e));
      const nextEdges = nextElements.filter((e) => isEdge(e));

      expect(nextNodes.length).to.be.equal(nodes.length - 1);
      expect(nextEdges.length).to.be.equal(edges.length - 2);
    });

    it('removes multiple nodes', () => {
      const elementsToRemove = [nodes[0], nodes[1]];
      const nextElements = removeElements(elementsToRemove, elements);
      const nextNodes = nextElements.filter((e) => isNode(e));
      const nextEdges = nextElements.filter((e) => isEdge(e));

      expect(nextNodes.length).to.be.equal(nodes.length - 2);
      expect(nextEdges.length).to.be.equal(0);
    });

    it('removes no node', () => {
      const nextElementsNoRemove = removeElements([], elements);
      expect(nextElementsNoRemove.length).to.be.equal(elements.length);
    });

    it('tries to removes node that does not exist', () => {
      const nextElementsNoRemove = removeElements([{ id: 'id-that-does-not-exist' }], elements);
      expect(nextElementsNoRemove.length).to.be.equal(elements.length);
    });

    it('removes an edge', () => {
      const nextElements = removeElements([edges[0]], elements);

      const nextNodes = nextElements.filter((e) => isNode(e));
      const nextEdges = nextElements.filter((e) => isEdge(e));

      expect(nextNodes.length).to.be.equal(nodes.length);
      expect(nextEdges.length).to.be.equal(edges.length - 1);
    });

    it('removes multiple edges', () => {
      const nextElements = removeElements([edges[0], edges[1]], elements);

      const nextNodes = nextElements.filter((e) => isNode(e));
      const nextEdges = nextElements.filter((e) => isEdge(e));

      expect(nextNodes.length).to.be.equal(nodes.length);
      expect(nextEdges.length).to.be.equal(edges.length - 2);
    });

    it('removes node and edge', () => {
      const nextElements = removeElements([nodes[0], edges[0]], elements);

      const nextNodes = nextElements.filter((e) => isNode(e));
      const nextEdges = nextElements.filter((e) => isEdge(e));

      expect(nextNodes.length).to.be.equal(nodes.length - 1);
      expect(nextEdges.length).to.be.equal(edges.length - 2);
    });
  });
});

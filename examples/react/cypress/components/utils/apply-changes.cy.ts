import { type Node, type Edge, NodeChange, EdgeChange, XYPosition, NodeChangeset } from '@xyflow/react';
import { addChange, EdgeChangeset } from '@xyflow/system';

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

describe('applyChanges Testing', () => {
  it('adds a node/edge', () => {
    const currentNodes: Node[] = [];
    const nodeChanges = new NodeChangeset([addChange(nodes[0])]);
    const nextNodes = nodeChanges.applyTo(currentNodes);
    expect(nextNodes.length).to.be.equal(nodeChanges.size);

    const currentEdges: Edge[] = [];
    const edgeChanges = new EdgeChangeset([addChange(edges[0])]);
    const nextEdges = edgeChanges.applyTo(currentEdges);

    expect(nextEdges.length).to.be.equal(1);
  });

  it('adds multiple nodes/edges', () => {
    const currentNodes: Node[] = [];
    const nodeChanges: NodeChange[] = [
      { type: 'add', item: nodes[0], id: nodes[0].id },
      { type: 'add', item: nodes[1], id: nodes[1].id },
    ];
    const nodeChangeset = new NodeChangeset(nodeChanges);
    const nextNodes = nodeChangeset.applyTo(currentNodes);
    expect(nextNodes.length).to.be.equal(nodeChanges.length);

    const currentEdges: Edge[] = [];
    const edgeChanges: EdgeChange[] = [
      { type: 'add', item: edges[0], id: edges[0].id },
      { type: 'add', item: edges[1], id: edges[1].id },
    ];
    const edgeChangeset = new EdgeChangeset(edgeChanges);
    const nextEdges = edgeChangeset.applyTo(currentEdges);
    expect(nextEdges.length).to.be.equal(edgeChanges.length);
  });

  it('removes a node/edge', () => {
    const nodesLength = nodes.length;
    const nodeChanges: NodeChange[] = [{ type: 'remove', id: '1' }];
    const nodeChangeset = new NodeChangeset(nodeChanges);
    const nextNodes = nodeChangeset.applyTo(nodes);
    expect(nextNodes.length).to.be.equal(nodes.length - nodeChanges.length);
    expect(nodes.length).to.be.equal(nodesLength);

    const edgesLength = edges.length;
    const edgeChanges: EdgeChange[] = [{ type: 'remove', id: 'e1-2' }];
    const edgeChangeset = new EdgeChangeset(edgeChanges);
    const nextEdges = edgeChangeset.applyTo(edges);
    expect(nextEdges.length).to.be.equal(edges.length - 1);
    expect(edges.length).to.be.equal(edgesLength);
  });

  it('removes multiple node/edge', () => {
    const nodesLength = nodes.length;
    const nodeChanges: NodeChange[] = [
      { type: 'remove', id: '1' },
      { type: 'remove', id: '2' },
    ];
    const nodeChangeset = new NodeChangeset(nodeChanges);
    const nextNodes = nodeChangeset.applyTo(nodes);
    expect(nextNodes.length).to.be.equal(nodes.length - nodeChanges.length);
    expect(nodes.length).to.be.equal(nodesLength);

    const edgesLength = edges.length;
    const edgeChanges: EdgeChange[] = [
      { type: 'remove', id: 'e1-2' },
      { type: 'remove', id: 'e1-3' },
    ];
    const edgeChangeset = new EdgeChangeset(edgeChanges);
    const nextEdges = edgeChangeset.applyTo(edges);
    expect(nextEdges.length).to.be.equal(edges.length - edgeChanges.length);
    expect(edges.length).to.be.equal(edgesLength);
  });

  it('selects a node/edge', () => {
    const nodeChangeset = new NodeChangeset([{ type: 'select', id: '1', selected: true }]);
    const nextNodes = nodeChangeset.applyTo(nodes);
    expect(nextNodes[0].selected).to.be.true;

    const edgeChangeset = new EdgeChangeset([{ type: 'select', id: 'e1-2', selected: true }]);
    const nextEdges = edgeChangeset.applyTo(edges);
    expect(nextEdges[0].selected).to.be.true;
  });

  it('deselects a node/edge', () => {
    const nodeChangeset = new NodeChangeset([{ type: 'select', id: '1', selected: false }]);
    const nextNodes = nodeChangeset.applyTo(nodes.map((n) => ({ ...n, selected: true })));
    expect(nextNodes[0].selected).to.be.false;
    expect(nextNodes[1].selected).to.be.true;

    const edgeChangeset = new EdgeChangeset([{ type: 'select', id: 'e1-2', selected: false }]);
    const nextEdges = edgeChangeset.applyTo(edges.map((e) => ({ ...e, selected: true })));
    expect(nextEdges[0].selected).to.be.false;
    expect(nextEdges[1].selected).to.be.true;
  });

  it('updates node position', () => {
    const newPosition: XYPosition = { x: 100, y: 100 };
    const nodeChangeset = new NodeChangeset([{ type: 'position', id: '1', position: newPosition }]);
    const nextNodes = nodeChangeset.applyTo(nodes);

    expect(nextNodes[0].position).to.be.deep.equal(newPosition);
  });

  it('updates node dimensions', () => {
    const newWidth = 200;
    const newHeight = 200;
    const nodeChangeset = new NodeChangeset([
      { type: 'dimensions', id: '1', dimensions: { width: newWidth, height: newHeight } },
    ]);
    const nextNodes = nodeChangeset.applyTo(nodes);

    expect(nodes[0].measured).to.be.undefined;
    expect(nextNodes[0].measured).to.be.deep.equal({ width: newWidth, height: newHeight });
    expect(nextNodes[0].width).to.be.undefined;
    expect(nextNodes[0].height).to.be.undefined;
  });

  it('updates node position and dimensions', () => {
    const newPosition: XYPosition = { x: 100, y: 100 };
    const newWidth = 200;
    const newHeight = 200;
    const nodeChangeset = new NodeChangeset([
      { type: 'position', id: '1', position: newPosition },
      { type: 'dimensions', id: '1', dimensions: { width: newWidth, height: newHeight } },
    ]);
    const nextNodes = nodeChangeset.applyTo(nodes);

    expect(nextNodes[0].position).to.be.deep.equal(newPosition);
    expect(nextNodes[0].measured).to.be.deep.equal({ width: newWidth, height: newHeight });
  });

  it('replaces nodes/edges', () => {
    const nodesLength = nodes.length;
    const nodeChanges = new NodeChangeset([{ type: 'replace', id: nodes[0].id, item: nodes[1] }]);

    const nextNodes = nodeChanges.applyTo(nodes);

    expect(nodes.length).to.be.equal(nodesLength);
    expect(nextNodes.length).to.be.equal(nodesLength);
    expect(nextNodes[0]).to.be.deep.equal(nodes[1]);

    const edgesLength = edges.length;
    const edgeChanges = new EdgeChangeset([{ type: 'replace', id: edges[0].id, item: edges[1] }]);
    const nextEdges = edgeChanges.applyTo(edges);

    expect(edges.length).to.be.equal(edgesLength);
    expect(nextEdges.length).to.be.equal(edgesLength);
    expect(nextEdges[0]).to.be.deep.equal(edges[1]);
  });
});

export {};

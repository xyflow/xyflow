import { useCallback, useState } from 'react';
import { OnNodesChange, Panel, ReactFlow, ReactFlowProps, applyNodeChanges, useReactFlow, Node } from '@xyflow/react';

const nodes = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
    style: { width: 100, height: 40 },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 200, y: 200 },
    style: { width: 80, height: 50 },
  },
];

describe('<ReactFlow />: onNodesChange', () => {
  beforeEach(() => {
    const onNodesChange = cy.spy().as('onNodesChange');
    cy.mount(<Comp nodes={nodes} onNodesChange={onNodesChange} />).wait(500);
  });

  it('receive initial dimension change', () => {
    const expectedChanges = nodes.map((n) => ({
      type: 'dimensions',
      id: n.id,
      dimensions: n.style,
    }));

    cy.get('@onNodesChange').should('have.callCount', 1);
    cy.get('@onNodesChange').should('have.calledWith', expectedChanges);
  });

  it('receive replace and dimension change', () => {
    const expectedDimensionChanges = [
      {
        type: 'dimensions',
        id: '1',
        dimensions: { width: 200, height: 100 },
      },
    ];

    const expectedReplaceChanges = [
      {
        type: 'replace',
        id: '1',
        item: {
          ...nodes[0],
          measured: { width: 200, height: 100 },
          style: { width: 200, height: 100 },
        },
      },
    ];

    cy.get('[data-id=update-btn]').click();

    cy.get('@onNodesChange').should('have.callCount', 3);
    cy.get('@onNodesChange').then((s) => {
      // dimension change (already checked above)
      // const firstCall = s.getCall(0);
      // replace change
      // @ts-ignore
      const secondChangeCallArgs = s.getCall(1).args[0];
      // dimension change
      // @ts-ignore
      const thirdChangeCallArgs = s.getCall(2).args[0];

      expect(secondChangeCallArgs).to.be.deep.eq(expectedReplaceChanges);
      expect(thirdChangeCallArgs).to.be.deep.eq(expectedDimensionChanges);
    });
  });

  it('receive select and unselect change', () => {
    const expectedSelectChanges = [{ id: '1', type: 'select', selected: true }];
    const expectedUnselectChanges = [{ id: '1', type: 'select', selected: false }];

    cy.get('.react-flow__node').first().click();
    cy.get('@onNodesChange').should('have.calledWith', expectedSelectChanges);

    cy.get('.react-flow__pane').first().click({ force: true });
    cy.get('@onNodesChange').should('have.calledWith', expectedUnselectChanges);
  });

  it('receive position change', () => {
    const endPosition = { x: 200, y: 25 };
    const expectedChanges = [
      { id: '1', type: 'position', dragging: false, position: endPosition, positionAbsolute: endPosition },
    ];

    cy.drag('.react-flow__node:first', endPosition).then(() => {
      cy.get('@onNodesChange').should('have.calledWith', expectedChanges);
    });
  });

  it('receive remove change', () => {
    const expectedChanges = [{ id: '1', type: 'remove' }];

    cy.get('.react-flow__node').first().click();
    cy.realPress('Backspace');

    cy.get('@onNodesChange').should('have.calledWith', expectedChanges);
  });
});

// test specific helpers

function UpdateButton() {
  const { updateNode } = useReactFlow();
  const updateNodeDimensions = () => {
    updateNode('1', { style: { width: 200, height: 100 } });
  };

  return (
    <Panel position="top-right">
      <button data-id="update-btn" onClick={updateNodeDimensions} id="btn">
        update
      </button>
    </Panel>
  );
}

type CompProps = ReactFlowProps & { onNodesChange: (changes: any) => void };

function Comp(props: CompProps) {
  const [nodes, setNodes] = useState(props.nodes || []);
  const onNodesChange: OnNodesChange<Node> = useCallback((changes) => {
    props.onNodesChange(changes);
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  return (
    <ReactFlow nodes={nodes} onNodesChange={onNodesChange} nodeDragThreshold={0}>
      <UpdateButton />
    </ReactFlow>
  );
}

import React, { useEffect } from 'react';
import { ReactFlow, Edge, useEdges } from '@xyflow/react';

import { nodes as initialNodes, edges as initialEdges } from '../../fixtures/simpleflow';

describe('useEdges.cy.tsx', () => {
  it('handles edges', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');

    cy.mount(
      <ReactFlow nodes={initialNodes} edges={initialEdges}>
        <HookHelperComponent onChange={onChangeSpy} />
      </ReactFlow>
    );

    cy.get('@onChangeSpy').should('have.been.calledWith', initialEdges);
  });

  it('handles defaultEdges', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');

    cy.mount(
      <ReactFlow defaultNodes={initialNodes} defaultEdges={initialEdges}>
        <HookHelperComponent onChange={onChangeSpy} />
      </ReactFlow>
    );

    cy.get('@onChangeSpy').should('have.been.calledWith', []);
    cy.get('@onChangeSpy').should('have.been.calledWith', initialEdges);
  });
});

const HookHelperComponent = ({ onChange }: { onChange: (edges: Edge[]) => void }) => {
  const edges = useEdges();

  useEffect(() => {
    onChange(edges);
  }, [edges]);

  return null;
};

import { useEffect } from 'react';
import { ReactFlow, Node, useNodes } from '@xyflow/react';

import { nodes } from '../../fixtures/simpleflow';

const nodeDimensions = {
  width: 100,
  height: 50,
};

const initialNodes: Node[] = nodes.map((n) => ({
  ...n,
  style: nodeDimensions,
}));

const expectedNodes: Node[] = initialNodes.map((n) => ({
  ...n,
  measured: {
    ...nodeDimensions,
  },
}));

describe('useNodes.cy.tsx', () => {
  it('handles nodes', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');

    cy.mount(
      <ReactFlow nodes={initialNodes}>
        <HookHelperComponent onChange={onChangeSpy} />
      </ReactFlow>
    );

    cy.get('@onChangeSpy').should('have.been.calledWith', expectedNodes);
  });

  it('handles defaultNodes', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');

    cy.mount(
      <ReactFlow defaultNodes={initialNodes}>
        <HookHelperComponent onChange={onChangeSpy} />
      </ReactFlow>
    );

    cy.get('@onChangeSpy').should('have.been.calledWith', []);
    cy.get('@onChangeSpy').should('have.been.calledWith', expectedNodes);
  });
});

const HookHelperComponent = ({ onChange }: { onChange: (nodes: Node[]) => void }) => {
  const nodes = useNodes();

  useEffect(() => {
    onChange(nodes);
  }, [nodes]);

  return null;
};

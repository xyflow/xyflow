import { ReactFlow, useNodesInitialized } from '@xyflow/react';

import { nodes } from '../../fixtures/simpleflow';
import ControlledFlow from '../../support/ControlledFlow';

describe('useNodesInitialized.cy.tsx', () => {
  it('returns false for no nodes', () => {
    const initSpy = cy.spy().as('initSpy');

    cy.mount(
      <ReactFlow nodes={[]}>
        <HookHelperComponent onChange={initSpy} />
      </ReactFlow>
    );

    // cy.get('@initSpy').should('to.be.calledOnce');
    cy.get('@initSpy').should('have.been.calledWith', false);
  });

  it('returns false without onNodesChange', () => {
    const initSpy = cy.spy().as('initSpy');

    cy.mount(
      <ReactFlow nodes={nodes}>
        <HookHelperComponent onChange={initSpy} />
      </ReactFlow>
    );

    // cy.get('@initSpy').should('to.be.calledOnce');
    cy.get('@initSpy').should('have.be.calledWith', false);
  });

  it('returns true for defaultNodes', () => {
    const initSpy = cy.spy().as('initSpy');

    cy.mount(
      <ReactFlow defaultNodes={nodes}>
        <HookHelperComponent onChange={initSpy} />
      </ReactFlow>
    );

    cy.get('@initSpy').should('have.been.calledWith', false);
    cy.get('@initSpy').should('have.been.calledWith', true);
  });

  it('returns true for nodes + onNodesChange', () => {
    const initSpy = cy.spy().as('initSpy');

    cy.mount(
      <ControlledFlow initialNodes={nodes}>
        <HookHelperComponent onChange={initSpy} />
      </ControlledFlow>
    );

    cy.get('@initSpy').should('have.been.calledWith', false);
    cy.get('@initSpy').should('have.been.calledWith', true);
  });
});

// test specific helpers

function HookHelperComponent({ onChange }: { onChange: (init: boolean) => void }) {
  const initialized = useNodesInitialized();

  onChange(initialized);

  return null;
}

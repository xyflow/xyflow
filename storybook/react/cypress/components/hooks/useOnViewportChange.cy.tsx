import { ReactFlow, useOnViewportChange, Viewport } from '@xyflow/react';

describe('useOnViewportChange.cy.tsx', () => {
  it('listen to viewport drag', () => {
    const onStartSpy = cy.spy().as('onStartSpy');
    const onChangeSpy = cy.spy().as('onChangeSpy');
    const onEndSpy = cy.spy().as('onEndSpy');

    cy.mount(
      <ReactFlow>
        <HookHelperComponent onStart={onStartSpy} onChange={onChangeSpy} onEnd={onEndSpy} />
      </ReactFlow>
    );

    cy.dragPane({ from: { x: 50, y: 50 }, to: { x: 50, y: 100 } }).then(() => {
      cy.get('@onStartSpy').should('have.been.calledWith', { x: 0, y: 0, zoom: 1 });
      cy.get('@onChangeSpy').should('have.been.calledWith', { x: 0, y: 50, zoom: 1 });
      cy.get('@onEndSpy').should('have.been.calledWith', { x: 0, y: 50, zoom: 1 });
    });
  });

  it('handles zoom in', () => {
    const onStartSpy = cy.spy().as('onStartSpy');
    const onChangeSpy = cy.spy().as('onChangeSpy');
    const onEndSpy = cy.spy().as('onEndSpy');

    cy.mount(
      <ReactFlow>
        <HookHelperComponent onStart={onStartSpy} onChange={onChangeSpy} onEnd={onEndSpy} />
      </ReactFlow>
    );

    cy.zoomPane(-200).then(() => {
      cy.get('@onStartSpy').should('have.been.callCount', 1);
      cy.get('@onChangeSpy').should('have.been.callCount', 1);
      cy.get('@onEndSpy').should('have.been.callCount', 1);

      expect(getLatestViewport(onChangeSpy).zoom).to.be.gt(1);
    });
  });

  it('handles zoom out', () => {
    const onStartSpy = cy.spy().as('onStartSpy');
    const onChangeSpy = cy.spy().as('onChangeSpy');
    const onEndSpy = cy.spy().as('onEndSpy');

    cy.mount(
      <ReactFlow>
        <HookHelperComponent onStart={onStartSpy} onChange={onChangeSpy} onEnd={onEndSpy} />
      </ReactFlow>
    );

    cy.zoomPane(200).then(() => {
      cy.get('@onStartSpy').should('have.been.callCount', 1);
      cy.get('@onChangeSpy').should('have.been.callCount', 1);
      cy.get('@onEndSpy').should('have.been.callCount', 1);

      expect(getLatestViewport(onChangeSpy).zoom).to.be.lt(1);
    });
  });

  it('handles default viewport', () => {
    const defaultViewport = { x: 100, y: 100, zoom: 0.5 };
    const onStartSpy = cy.spy().as('onStartSpy');

    cy.mount(
      <ReactFlow defaultViewport={defaultViewport}>
        <HookHelperComponent onStart={onStartSpy} />
      </ReactFlow>
    );

    cy.dragPane({ from: { x: 50, y: 50 }, to: { x: 50, y: 100 } }).then(() => {
      cy.get('@onStartSpy').should('have.been.calledWith', defaultViewport);
    });
  });
});

// test specific helpers

function HookHelperComponent({
  onStart,
  onChange,
  onEnd,
}: {
  onStart?: (viewport: Viewport) => void;
  onChange?: (viewport: Viewport) => void;
  onEnd?: (viewport: Viewport) => void;
}) {
  useOnViewportChange({ onStart, onChange, onEnd });

  return null;
}

function getLatestViewport(onChangeSpy: any) {
  return onChangeSpy.lastCall.args[0] as unknown as Viewport;
}

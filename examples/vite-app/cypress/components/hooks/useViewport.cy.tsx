import { ReactFlow, useViewport, Viewport } from '@xyflow/react';

describe('useViewport.cy.tsx', () => {
  it('handles drag', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');

    cy.mount(
      <ReactFlow>
        <HookHelperComponent onChange={onChangeSpy} />
      </ReactFlow>
    );

    cy.get('@onChangeSpy').should('have.been.calledWith', { x: 0, y: 0, zoom: 1 });

    cy.dragPane({ from: { x: 50, y: 0 }, to: { x: 50, y: 400 } }).then(() => {
      cy.get('@onChangeSpy').should('have.been.callCount', 2);
      cy.get('@onChangeSpy').should('have.been.calledWith', { x: 0, y: 0, zoom: 1 });

      expect(getLatestViewport(onChangeSpy)).to.eql({ x: 0, y: 400, zoom: 1 });
    });
  });

  it('handles zoom in', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');

    cy.mount(
      <ReactFlow>
        <HookHelperComponent onChange={onChangeSpy} />
      </ReactFlow>
    );

    cy.zoomPane(-200).then(() => {
      cy.get('@onChangeSpy').should('have.been.callCount', 2);
      expect(getLatestViewport(onChangeSpy).zoom).to.be.gt(1);
    });
  });

  it('handles zoom out', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');

    cy.mount(
      <ReactFlow>
        <HookHelperComponent onChange={onChangeSpy} />
      </ReactFlow>
    );

    cy.zoomPane(200).then(() => {
      cy.get('@onChangeSpy').should('have.been.callCount', 2);
      expect(getLatestViewport(onChangeSpy).zoom).to.be.lt(1);
    });
  });

  it('handles default viewport', () => {
    const defaultViewport = { x: 100, y: 100, zoom: 0.5 };
    const onChangeSpy = cy.spy().as('onChangeSpy');

    cy.mount(
      <ReactFlow defaultViewport={defaultViewport}>
        <HookHelperComponent onChange={onChangeSpy} />
      </ReactFlow>
    );

    cy.get('@onChangeSpy').should('have.been.calledWith', defaultViewport);
  });
});

// test specific helpers

function HookHelperComponent({ onChange }: { onChange: (vp: Viewport) => void }) {
  const viewport = useViewport();

  onChange(viewport);

  return null;
}

function getLatestViewport(onChangeSpy: any) {
  return onChangeSpy.lastCall.args[0] as unknown as Viewport;
}

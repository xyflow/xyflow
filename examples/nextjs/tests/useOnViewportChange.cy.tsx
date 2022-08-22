import { ReactFlow, useOnViewportChange, Viewport } from '@react-flow/bundle';

describe('useOnViewportChange.cy.js', () => {
  it('listen to viewport drag', () => {
    let startViewport = {};
    let changeViewport = {};
    let endViewport = {};

    const onStart = (viewport: Viewport) => {
      startViewport = viewport;
    };
    const onChange = (viewport: Viewport) => {
      changeViewport = viewport;
    };
    const onEnd = (viewport: Viewport) => {
      endViewport = viewport;
    };

    cy.mount(
      <ReactFlow>
        <OnViewportChange onStart={onStart} onChange={onChange} onEnd={onEnd} />
      </ReactFlow>
    );

    cy.window().then((win: any) => {
      cy.get('.react-flow__pane')
        .trigger('mousedown', 50, 50, { which: 1, view: win })
        .trigger('mousemove', 50, 100)
        .trigger('mouseup', { force: true, view: win })
        .then(() => {
          expect(startViewport).to.eql({ x: 0, y: 0, zoom: 1 });
          expect(changeViewport).to.not.eql({ x: 0, y: 0, zoom: 1 });
          expect(endViewport).to.eql({ x: 0, y: 50, zoom: 1 });
        });
    });
  });

  it('handles default viewport', () => {
    const defaultViewport = { x: 100, y: 100, zoom: 0.5 };
    let startViewport = {};

    const onStart = (viewport: Viewport) => {
      startViewport = viewport;
    };

    cy.mount(
      <ReactFlow defaultViewport={defaultViewport}>
        <OnViewportChange onStart={onStart} />
      </ReactFlow>
    );

    cy.window().then((win: any) => {
      cy.get('.react-flow__pane')
        .trigger('mousedown', 50, 50, { which: 1, view: win })
        .trigger('mousemove', 50, 100)
        .trigger('mouseup', { force: true, view: win })
        .then(() => {
          expect(startViewport).to.eql(defaultViewport);
        });
    });
  });
});

function OnViewportChange({
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

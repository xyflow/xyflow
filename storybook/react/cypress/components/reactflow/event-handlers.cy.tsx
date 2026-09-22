import { skipOn } from '@cypress/skip-test';

import { nodes, edges } from '../../fixtures/simpleflow';
import ControlledFlow from '../../support/ControlledFlow';

describe('<ReactFlow />: Event handlers', () => {
  describe('Node event handlers', () => {
    it('handles onInit', () => {
      const onInitSpy = cy.spy().as('onInitSpy');

      cy.mount(<ControlledFlow initialNodes={nodes} initialEdges={edges} onInit={onInitSpy} />)
        .wait(100)
        .then(() => {
          expect(onInitSpy.callCount).to.be.eq(1);
        });
    });

    it('handles onNodeClick', () => {
      const onNodeClickSpy = cy.spy().as('onNodeClickSpy');

      cy.mount(<ControlledFlow initialNodes={nodes} initialEdges={edges} onNodeClick={onNodeClickSpy} />).then(() => {
        expect(onNodeClickSpy.callCount).to.be.eq(0);
        cy.get('.react-flow__node:first')
          .click()
          .then(() => {
            expect(onNodeClickSpy.callCount).to.be.eq(1);
          });
      });
    });

    it('handles onNodeDrag handlers', () => {
      const onNodeDragStart = cy.spy().as('onNodeDragStart');
      const onNodeDrag = cy.spy().as('onNodeDrag');
      const onNodeDragStop = cy.spy().as('onNodeDragStop');

      cy.mount(
        <ControlledFlow
          initialNodes={nodes}
          initialEdges={edges}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
        />
      ).then(() => {
        expect(onNodeDragStart.callCount).to.be.eq(0);
        expect(onNodeDrag.callCount).to.be.eq(0);
        expect(onNodeDragStop.callCount).to.be.eq(0);

        cy.drag('.react-flow__node:first', { x: 200, y: 0 }).then(() => {
          expect(onNodeDragStart.callCount).to.be.gt(0);
          expect(onNodeDrag.callCount).to.be.gt(0);
          expect(onNodeDragStop.callCount).to.be.gt(0);
        });
      });
    });

    it('handles onNodeMouse handlers', () => {
      const onNodeMouseEnter = cy.spy().as('onNodeMouseEnter');
      const onNodeMouseMove = cy.spy().as('onNodeMouseMove');
      const onNodeMouseLeave = cy.spy().as('onNodeMouseLeave');
      const onNodeContextMenu = cy.spy().as('onNodeContextMenu');
      const onNodeDoubleClick = cy.spy().as('onNodeDoubleClick');

      cy.mount(
        <ControlledFlow
          initialNodes={nodes}
          initialEdges={edges}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseMove={onNodeMouseMove}
          onNodeMouseLeave={onNodeMouseLeave}
          onNodeContextMenu={onNodeContextMenu}
          onNodeDoubleClick={onNodeDoubleClick}
        />
      )
        .wait(200)
        .then(() => {
          expect(onNodeMouseEnter.callCount).to.be.eq(0);
          expect(onNodeMouseMove.callCount).to.be.eq(0);
          expect(onNodeMouseLeave.callCount).to.be.eq(0);
          expect(onNodeContextMenu.callCount).to.be.eq(0);
          expect(onNodeDoubleClick.callCount).to.be.eq(0);

          const node = cy.get('.react-flow__node').contains('Node 1');

          node
            .rightclick()
            .dblclick()
            .then(() => {
              expect(onNodeContextMenu.callCount).to.be.eq(1);
              expect(onNodeDoubleClick.callCount).to.be.eq(1);
            });

          skipOn('firefox');

          node
            .realHover()
            .realMouseMove(100, 100)
            .then(() => {
              expect(onNodeMouseEnter.callCount).to.be.gt(0);
              expect(onNodeMouseMove.callCount).to.be.gt(0);
              expect(onNodeMouseLeave.callCount).to.be.gt(0);
            });
        });
    });
  });

  describe('Edge event handlers', () => {
    it('handles onEdgeClick', () => {
      const onEdgeClick = cy.spy().as('onEdgeClick');

      cy.mount(<ControlledFlow initialNodes={nodes} initialEdges={edges} onEdgeClick={onEdgeClick} />).then(() => {
        expect(onEdgeClick.callCount).to.be.eq(0);
        cy.get('.react-flow__edge:first')
          .click()
          .then(() => {
            expect(onEdgeClick.callCount).to.be.eq(1);
          });
      });
    });

    it('handles onEdgeMouse handlers', () => {
      const onEdgeMouseEnter = cy.spy().as('onEdgeMouseEnter');
      const onEdgeMouseMove = cy.spy().as('onEdgeMouseMove');
      const onEdgeMouseLeave = cy.spy().as('onEdgeMouseLeave');
      const onEdgeContextMenu = cy.spy().as('onEdgeContextMenu');
      const onEdgeDoubleClick = cy.spy().as('onEdgedoubleClick');

      cy.mount(
        <ControlledFlow
          initialNodes={nodes}
          initialEdges={edges}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onEdgeMouseMove={onEdgeMouseMove}
          onEdgeMouseLeave={onEdgeMouseLeave}
          onEdgeContextMenu={onEdgeContextMenu}
          onEdgeDoubleClick={onEdgeDoubleClick}
        />
      )
        .wait(200)
        .then(() => {
          expect(onEdgeMouseEnter.callCount).to.be.eq(0);
          expect(onEdgeMouseMove.callCount).to.be.eq(0);
          expect(onEdgeMouseLeave.callCount).to.be.eq(0);
          expect(onEdgeContextMenu.callCount).to.be.eq(0);
          expect(onEdgeDoubleClick.callCount).to.be.eq(0);

          const edge = cy.get('.react-flow__edge:first');

          edge
            .rightclick()
            .dblclick()
            .then(() => {
              expect(onEdgeContextMenu.callCount).to.be.eq(1);
            });

          skipOn('firefox');

          edge
            .realHover()
            .realMouseMove(100, 100)
            .then(() => {
              expect(onEdgeMouseEnter.callCount).to.be.gt(0);
              expect(onEdgeMouseMove.callCount).to.be.gt(0);
              expect(onEdgeMouseLeave.callCount).to.be.gt(0);
            });
        });
    });
  });

  describe('Pane event handlers', () => {
    it('handles onMove handlers', () => {
      const onMoveStart = cy.spy().as('onMoveStart');
      const onMove = cy.spy().as('onMove');
      const onMoveEnd = cy.spy().as('onMoveEnd');

      cy.mount(<ControlledFlow onMoveStart={onMoveStart} onMove={onMove} onMoveEnd={onMoveEnd} />).then(() => {
        expect(onMoveStart.callCount).to.be.eq(0);
        expect(onMove.callCount).to.be.eq(0);
        expect(onMoveEnd.callCount).to.be.eq(0);

        cy.dragPane({ from: { x: 10, y: 200 }, to: { x: 100, y: 200 } })
          .wait(100)
          .then(() => {
            expect(onMoveStart.callCount).to.be.eq(1);
            expect(onMove.callCount).to.be.gt(0);
            expect(onMoveEnd.callCount).to.be.eq(1);
          });
      });
    });

    it('handles click handlers', () => {
      const onPaneClick = cy.spy().as('onPaneClick');
      const onPaneContextMenu = cy.spy().as('onPaneContextMenu');

      cy.mount(<ControlledFlow onPaneClick={onPaneClick} onPaneContextMenu={onPaneContextMenu} />).then(() => {
        expect(onPaneClick.callCount).to.be.eq(0);
        expect(onPaneContextMenu.callCount).to.be.eq(0);

        cy.get('.react-flow__pane')
          .rightclick()
          .click()
          .wait(100)
          .then(() => {
            expect(onPaneClick.callCount).to.be.eq(1);
            expect(onPaneContextMenu.callCount).to.be.eq(1);
          });
      });
    });
  });
});

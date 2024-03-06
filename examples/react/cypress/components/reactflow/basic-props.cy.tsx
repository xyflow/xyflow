import { ReactFlow, EdgeProps } from '@xyflow/react';

import ControlledFlow from '../../support/ControlledFlow';
import * as simpleflow from '../../fixtures/simpleflow';

describe('<ReactFlow />: Basic Props', () => {
  describe('uses defaultNodes and defaultEdges', () => {
    beforeEach(() => {
      cy.mount(<ReactFlow defaultNodes={simpleflow.nodes} defaultEdges={simpleflow.edges} nodeDragThreshold={0} />);
    });

    it('mounts nodes and edges', () => {
      cy.get('.react-flow__node').should('have.length', simpleflow.nodes.length);
      cy.get('.react-flow__edge').should('have.length', simpleflow.edges.length);
    });

    it('drags a node', () => {
      const styleBeforeDrag = Cypress.$('.react-flow__node:first').css('transform');

      cy.drag('.react-flow__node:first', { x: 200, y: 25 }).then(($el: JQuery<HTMLElement>) => {
        const styleAfterDrag = $el.css('transform');
        expect(styleBeforeDrag).to.not.equal(styleAfterDrag);
      });
    });
  });

  describe('uses nodes and edges', () => {
    beforeEach(() => {
      cy.mount(
        <ControlledFlow
          addOnNodeChangeHandler={false}
          initialNodes={simpleflow.nodes}
          initialEdges={simpleflow.edges}
        />
      );
    });

    it('mounts nodes and edges', () => {
      cy.get('.react-flow__node').should('have.length', simpleflow.nodes.length);
      cy.get('.react-flow__edge').should('have.length', simpleflow.edges.length);
    });

    it('can not drag a node', () => {
      const styleBeforeDrag = Cypress.$('.react-flow__node:first').css('transform');

      cy.drag('.react-flow__node:first', { x: 200, y: 25 }).then(($el: JQuery<HTMLElement>) => {
        const styleAfterDrag = $el.css('transform');
        expect(styleBeforeDrag).to.equal(styleAfterDrag);
      });
    });
  });

  describe('uses onNodesChange handler', () => {
    beforeEach(() => {
      cy.mount(<ControlledFlow addOnConnectHandler={false} initialNodes={simpleflow.nodes} />);
    });

    it('mounts nodes', () => {
      cy.get('.react-flow__node').should('have.length', simpleflow.nodes.length);
      cy.get('.react-flow__edge').should('have.length', 0);
    });

    it('drags a node', () => {
      const styleBeforeDrag = Cypress.$('.react-flow__node:first').css('transform');

      cy.drag('.react-flow__node:first', { x: 200, y: 25 }).then(($el: JQuery<HTMLElement>) => {
        const styleAfterDrag = $el.css('transform');
        expect(styleBeforeDrag).to.not.equal(styleAfterDrag);
      });
    });

    it('can not connect nodes', () => {
      cy.get('.react-flow__node').first().find('.react-flow__handle.source').trigger('mousedown', { button: 0 });

      cy.get('.react-flow__node')
        .last()
        .find('.react-flow__handle.target')
        .trigger('mousemove')
        .trigger('mouseup', { force: true });

      cy.get('.react-flow__edge').should('have.length', 0);
    });
  });

  describe('uses onEdgeChange handler', () => {
    beforeEach(() => {
      cy.mount(<ControlledFlow initialNodes={simpleflow.nodes} initialEdges={simpleflow.edges} />);
    });

    it('mounts nodes and edges', () => {
      cy.get('.react-flow__node').should('have.length', simpleflow.nodes.length);
      cy.get('.react-flow__edge').should('have.length', simpleflow.edges.length);
    });

    it('selects an edge', () => {
      cy.get('.react-flow__edge').first().click().should('have.class', 'selected');
    });
  });

  describe('uses onConnect handlers', () => {
    beforeEach(() => {
      cy.mount(<ControlledFlow initialNodes={simpleflow.nodes} />);
    });

    it('mounts nodes', () => {
      cy.get('.react-flow__node').should('have.length', simpleflow.nodes.length);
      cy.get('.react-flow__edge').should('have.length', 0);
    });

    it('connects nodes', () => {
      cy.get('.react-flow__node').first().find('.react-flow__handle.source').trigger('mousedown', { button: 0 });

      cy.get('.react-flow__node')
        .last()
        .find('.react-flow__handle.target')
        .trigger('mousemove')
        .trigger('mouseup', { force: true });

      cy.get('.react-flow__edge').should('have.length', 1);
    });
  });

  describe('uses nodeTypes', () => {
    it('renders custom nodes', () => {
      const nodeTypes = {
        custom: () => <div className="customnode">custom node</div>,
      };

      const initialNodes = simpleflow.nodes.map((n) => ({
        ...n,
        type: 'custom',
      }));

      cy.mount(<ControlledFlow nodeTypes={nodeTypes} initialNodes={initialNodes} />);

      cy.get('.react-flow__node-custom').should('have.length', simpleflow.nodes.length);
      cy.get('.react-flow').contains('custom node');
    });

    it('tries invalid node type - should fallback to default', () => {
      const initialNodes = simpleflow.nodes.map((n) => ({
        ...n,
        type: 'invalid',
      }));

      cy.mount(<ControlledFlow initialNodes={initialNodes} />);

      cy.get('.react-flow__node-invalid').should('have.length', 0);
      cy.get('.react-flow__node-default').should('have.length', simpleflow.nodes.length);
    });
  });

  describe('uses edgeTypes', () => {
    it('renders custom edge', () => {
      const edgeTypes = {
        custom: ({ sourceX, sourceY, targetX, targetY }: EdgeProps) => (
          <path d={`M${sourceX} ${sourceY} L${targetX} ${targetY}`} stroke="black" />
        ),
      };

      const initialEdges = simpleflow.edges.map((e) => ({
        ...e,
        type: 'custom',
      }));

      cy.mount(<ControlledFlow edgeTypes={edgeTypes} initialNodes={simpleflow.nodes} initialEdges={initialEdges} />);

      cy.get('.react-flow__edge-custom').should('have.length', simpleflow.edges.length);
    });

    it('tries invalid edge type - should fallback to default', () => {
      const initialEdges = simpleflow.edges.map((e) => ({
        ...e,
        type: 'invalid',
      }));

      cy.mount(<ControlledFlow initialNodes={simpleflow.nodes} initialEdges={initialEdges} />);

      cy.get('.react-flow__edge-invalid').should('have.length', 0);
      cy.get('.react-flow__edge-default').should('have.length', simpleflow.edges.length);
    });
  });

  it('uses style', () => {
    const styles = {
      backgroundColor: 'red',
    };

    cy.mount(<ControlledFlow style={styles} />);
    cy.get('.react-flow').should('have.css', 'background-color', 'rgb(255, 0, 0)');
  });

  it('uses classname', () => {
    cy.mount(<ControlledFlow className="custom" />);
    cy.get('.react-flow').should('have.class', 'custom');
  });
});

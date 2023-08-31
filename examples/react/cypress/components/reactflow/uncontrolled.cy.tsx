import { ReactFlow } from '@xyflow/react';

import { nodes, edges } from '../../fixtures/simpleflow';

describe('<ReactFlow />: Uncontrolled Flow', () => {
  beforeEach(() => {
    cy.mount(<ReactFlow defaultNodes={nodes} defaultEdges={edges} />);
  });

  it('mounts nodes and edges', () => {
    cy.get('.react-flow__node').should('have.length', nodes.length);
    cy.get('.react-flow__edge').should('have.length', edges.length);
  });

  it('selects a node', () => {
    cy.get('.react-flow__node').first().click().should('have.class', 'selected');
    cy.get('.react-flow__pane').click();
    cy.get('.react-flow__node').first().should('not.have.class', 'selected');
  });

  it('drags a node', () => {
    const styleBeforeDrag = Cypress.$('.react-flow__node:first').css('transform');

    cy.drag('.react-flow__node:first', { x: 200, y: 25 }).then(($el: JQuery<HTMLElement>) => {
      const styleAfterDrag = $el.css('transform');
      expect(styleBeforeDrag).to.not.equal(styleAfterDrag);
    });
  });

  it('selects an edge', () => {
    cy.get('.react-flow__edge').first().click().should('have.class', 'selected');
    cy.get('.react-flow__pane').click();
    cy.get('.react-flow__edge').first().should('not.have.class', 'selected');
  });
});

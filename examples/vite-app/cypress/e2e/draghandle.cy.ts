describe('DragHandle Flow Rendering', { testIsolation: false }, () => {
  before(() => {
    cy.visit('/DragHandle');
  });

  it('renders a flow with a node', () => {
    cy.get('.react-flow__renderer');
    cy.get('.react-flow__node').should('have.length', 1);
  });

  it('tries to drag a node', () => {
    const $nodeElement = Cypress.$('.react-flow__node:first');
    const styleBeforeDrag = $nodeElement.css('transform');

    cy.drag('.react-flow__node:first', { x: 500, y: 500 }).then(() => {
      const styleAfterDrag = $nodeElement.css('transform');
      expect(styleBeforeDrag).to.be.equal(styleAfterDrag);
    });
  });

  it('drags a node', () => {
    const $nodeElement = Cypress.$('.react-flow__node:first');
    const styleBeforeDrag = $nodeElement.css('transform');

    cy.drag('.custom-drag-handle:first', { x: 500, y: 500 }).then(() => {
      const styleAfterDrag = $nodeElement.css('transform');
      expect(styleBeforeDrag).to.not.equal(styleAfterDrag);
    });
  });
});

export {};

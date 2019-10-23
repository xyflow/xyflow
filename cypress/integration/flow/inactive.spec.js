describe('Inactive Graph Rendering', () => {
  it('renders a graph', () => {
    cy.visit('/inactive');

    cy.get('.react-flow__renderer');
    cy.get('.react-flow__node').should('have.length', 4);
    cy.get('.react-flow__edge').should('have.length', 2);
    cy.get('.react-flow__node')
      .children('div')
      .children('.react-flow__handle');
  });

  it('tries to select a node by click', () => {
    cy.get('.react-flow__node:first')
      .click()
      .should('have.not.class', 'selected');
  });

  it('tries to select an edge by click', () => {
    cy.get('.react-flow__edge:first')
      .click()
      .should('have.not.class', 'selected');
  });

  it('tries to do a selection', () => {
    cy.get('body')
      .type('{shift}', { release: false })
      .get('.react-flow__selectionpane')
      .should('not.exist');
  });

  it('tries to drag a node', () => {
    const styleBeforeDrag = Cypress.$('.react-flow__node:first').css('transform');

    cy.drag('.react-flow__node:first', { x: 500, y: 25 }).then($el => {
      const styleAfterDrag = $el.css('transform');
      expect(styleBeforeDrag).to.equal(styleAfterDrag);
    });
  });

  it('tries to connect nodes', () => {
    cy.get('.react-flow__node')
      .contains('Node 3')
      .find('.react-flow__handle.source')
      .trigger('mousedown', { which: 1 });

    cy.get('.react-flow__node')
      .contains('Node 4')
      .find('.react-flow__handle.target')
      .trigger('mousemove')
      .trigger('mouseup', { force: true });

    cy.get('.react-flow__edge').should('have.length', 2);
  });

  it('toggles interactive mode', () => {
    cy.get('.react-flow__interactive').click();
  });

  it('selects a node by click', () => {
    cy.get('.react-flow__node:first')
      .click()
      .should('have.class', 'selected');
  });

  it('selects an edge by click', () => {
    cy.get('.react-flow__edge:first')
      .click()
      .should('have.class', 'selected');
  });
});

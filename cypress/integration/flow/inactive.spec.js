describe('Inactive Graph Rendering', () => {
  it('renders a graph', () => {
    cy.visit('/inactive');

    cy.get('.react-flow__renderer');
    cy.get('.react-flow__node').should('have.length', 4);
    cy.get('.react-flow__edge').should('have.length', 2);
    cy.get('.react-flow__node').children('.react-flow__handle');
  });

  it('tries to select a node by click', () => {
    const pointerEvents = Cypress.$('.react-flow__node:first').css('pointer-events');
    expect(pointerEvents).to.equal('none');
  });

  it('tries to select an edge by click', () => {
    const pointerEvents = Cypress.$('.react-flow__edge:first').css('pointer-events');
    expect(pointerEvents).to.equal('none');
  });

  it('tries to do a selection', () => {
    cy.get('body').type('{shift}', { release: false }).get('.react-flow__selectionpane').should('not.exist');

    cy.get('body').type('{shift}', { release: true });
  });

  it('toggles interactive mode', () => {
    cy.get('.react-flow__interactive').click();
  });

  it('selects a node by click', () => {
    cy.get('.react-flow__node:first').click().should('have.class', 'selected');
  });

  it('selects an edge by click', () => {
    cy.get('.react-flow__edge:first').click().should('have.class', 'selected');
  });
});

describe('Overview Graph Rendering', () => {
  it('renders a graph', () => {
    cy.visit('/');

    cy.get('.react-flow__renderer');

    cy.get('.react-flow__node').should('have.length', 7);
    cy.get('.react-flow__edge').should('have.length', 6);
  });

  it('renders a grid', () => {
    cy.get('.react-flow__background');

    const gridStroke = Cypress.$('.react-flow__background path').attr('fill');
    expect(gridStroke).to.equal('#888');
  });
});

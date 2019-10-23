describe('Custom Node Graph Rendering', () => {
  it('renders a graph', () => {
    cy.visit('/custom-node');

    cy.get('.react-flow__renderer');

    cy.get('.react-flow__node').should('have.length', 4);
    cy.get('.react-flow__edge').should('have.length', 3);
  });
});

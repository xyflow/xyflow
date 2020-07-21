describe('Custom Node Flow Rendering', () => {
  before(() => {
    cy.visit('/custom-node');
  });

  it('renders initial flow', () => {
    cy.get('.react-flow__renderer');

    cy.get('.react-flow__node').should('have.length', 4);
    cy.get('.react-flow__edge').should('have.length', 3);
  });
});

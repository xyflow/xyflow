describe('Stress Flow Rendering', () => {
  it('renders initial flow', () => {
    cy.visit('/stress');

    cy.get('.react-flow__renderer');

    cy.get('.react-flow__node').should('have.length', 100);
    cy.get('.react-flow__edge').should('have.length', 99);
  });
});

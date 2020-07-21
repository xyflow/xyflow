describe('Stress Flow Rendering', () => {
  before(() => {
    cy.visit('/stress');
  });

  it('renders initial flow', () => {
    cy.get('.react-flow__renderer');
    cy.get('.react-flow__node').should('have.length', 100);
    cy.get('.react-flow__edge').should('have.length', 99);
  });
});

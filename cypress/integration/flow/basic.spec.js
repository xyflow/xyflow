describe('Basis Flow', function() {
  it('renders a flow with some nodes', function() {
    cy.visit('/basic.html');

    cy.get('.react-graph__node').should('have.length', 3);
    cy.get('.react-graph__edge').should('have.length', 2);
  });
})
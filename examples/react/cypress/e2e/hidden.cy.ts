describe('Hidden Flow Rendering', { testIsolation: false }, () => {
  before(() => {
    cy.visit('/Hidden');
  });

  it('renders empty flow', () => {
    cy.get('.react-flow__node').should('not.exist');
    cy.get('.react-flow__edge').should('not.exist');
    cy.get('.react-flow__minimap-node').should('not.exist');
  });

  it('toggles isHidden mode', () => {
    cy.get('.react-flow__ishidden').click();
  });

  it('renders initial flow', () => {
    cy.get('.react-flow__renderer');
    cy.get('.react-flow__node').should('have.length', 4);
    cy.get('.react-flow__edge').should('have.length', 3);
    cy.get('.react-flow__minimap-node').should('have.length', 4);
  });

  it('toggles isHidden mode again', () => {
    cy.get('.react-flow__ishidden').click();
  });

  it('renders empty flow', () => {
    cy.get('.react-flow__node').should('not.exist');
    cy.get('.react-flow__edge').should('not.exist');
    cy.get('.react-flow__minimap-node').should('not.exist');
  });
});

export {};

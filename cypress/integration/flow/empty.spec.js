describe('Empty Flow Rendering', () => {
  it('renders an empty graph', () => {
    cy.visit('/empty');

    cy.get('.react-flow__renderer');
    cy.get('.react-flow__node').should('not.exist');
    cy.get('.react-flow__edge').should('not.exist');
  });

  it('renders a control panel', () => {
    cy.get('.react-flow__controls');
  });

  it('renders a mini map', () => {
    cy.get('.react-flow__minimap');
  });
});

describe('Hidden Flow Rendering', { testIsolation: false }, () => {
  before(() => {
    cy.visitStory('examples-nodes-hidden--default');
  });

  it('renders empty flow', () => {
    cy.get('.react-flow__node').should('not.exist');
    cy.get('.react-flow__edge').should('not.exist');
    cy.get('.react-flow__minimap-node').should('not.exist');
  });

  it('toggles isHidden mode', () => {
    cy.updateStoryArgs({ isHidden: false });
  });

  it('renders initial flow', () => {
    cy.get('.react-flow__renderer');
    cy.get('.react-flow__node').should('have.length', 4);
    cy.get('.react-flow__edge').should('have.length', 2);
    cy.get('.react-flow__minimap-node').should('have.length', 4);
  });

  it('toggles isHidden mode again', () => {
    cy.updateStoryArgs({ isHidden: true });
  });

  it('renders empty flow', () => {
    cy.get('.react-flow__node').should('not.exist');
    cy.get('.react-flow__edge').should('not.exist');
    cy.get('.react-flow__minimap-node').should('not.exist');
  });
});

export {};

describe('Update-node Flow Rendering', () => {
  before(() => {
    cy.visit('/update-node');
  });

  it('renders initial flow', () => {
    cy.get('.react-flow__renderer');
    cy.get('.react-flow__node').should('have.length', 2);
    cy.get('.react-flow__edge').should('have.length', 1);
  });

  it('toggles nodeAlwaysOnTop mode', () => {
    cy.get('.react-flow__nodealwaysontop').click().should('be.checked');
    cy.get('.react-flow__node:first').should('have.css', 'z-index').and('match', /15/);
    cy.get('.react-flow__nodealwaysontop').click().should('not.be.checked');
  });

  it('toggles nodeAlwaysOnBottom mode', () => {
    cy.get('.react-flow__nodealwaysonbottom').click().should('be.checked');
    cy.get('.react-flow__node:first').should('have.css', 'z-index').and('match', /-5/);
    cy.get('.react-flow__nodealwaysonbottom').click().should('not.be.checked');
  });

  it('toggles nodeAlwaysOnTop mode and selects node', () => {
    cy.get('.react-flow__nodealwaysontop').click().should('be.checked');
    cy.get('.react-flow__node:first').click().should('have.css', 'z-index').and('match', /20/);
    cy.get('.react-flow__nodealwaysontop').click().should('not.be.checked');
    cy.get('.react-flow__renderer').click('bottomRight');
  });

  it('toggles nodeAlwaysOnBottom mode and selects node', () => {
    cy.get('.react-flow__nodealwaysonbottom').click().should('be.checked');
    cy.get('.react-flow__node:first').click().should('have.css', 'z-index').and('match', /-1/);
    cy.get('.react-flow__nodealwaysonbottom').click().should('not.be.checked');
    cy.get('.react-flow__renderer').click('bottomRight');
  });

  it('toggles both nodeAlwaysOnBottom and nodeAlwaysOnTop mode and selects node ', () => {
    cy.get('.react-flow__nodealwaysonbottom').click();
    cy.get('.react-flow__nodealwaysontop').click();
    cy.get('.react-flow__node:first').should('have.css', 'z-index').and('match', /3/);
    cy.get('.react-flow__node:first').click().should('have.css', 'z-index').and('match', /10/);
    cy.get('.react-flow__nodealwaysonbottom').click().should('not.be.checked');
    cy.get('.react-flow__nodealwaysontop').click().should('not.be.checked');
    cy.get('.react-flow__renderer').click('bottomRight');
  });
});

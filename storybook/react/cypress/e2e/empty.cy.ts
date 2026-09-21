describe('Empty Flow Rendering', { testIsolation: false }, () => {
  before(() => {
    cy.visitStory('examples-state-api-empty--default');
  });

  it('renders an empty flow', () => {
    cy.get('.react-flow__renderer');
    cy.get('.react-flow__node').should('not.exist');
    cy.get('.react-flow__edge').should('not.exist');
  });

  it('renders empty selection', () => {
    cy.get('.react-flow__renderer').click();
    cy.get('body')
      .type('{shift}', { release: false })
      .wait(50)
      .get('.react-flow__pane')
      .trigger('mousedown', 400, 50, { button: 0, force: true })
      .trigger('mousemove', 200, 200, { button: 0 })
      .wait(50)
      .trigger('mouseup', 200, 200, { force: true });

    cy.get('body').type('{shift}', { release: true });
  });

  it('adds two nodes', () => {
    cy.contains('add node').click();
    cy.contains('add node').click();
  });

  it('connects nodes', () => {
    cy.connectNodes('1', '2');

    cy.get('.react-flow__edge').should('have.length', 1);
  });
});

export {};

describe('Empty Flow Rendering', () => {
  before(() => {
    cy.visit('/empty');
  });

  it('renders an empty flow', () => {
    cy.get('.react-flow__renderer');
    cy.get('.react-flow__node').should('not.exist');
    cy.get('.react-flow__edge').should('not.exist');
  });

  it('renders empty selection', () => {
    cy.get('body')
      .type('{shift}', { release: false })
      .get('.react-flow__selectionpane')
      .trigger('mousedown', 'topLeft', { which: 1, force: true })
      .trigger('mousemove', 'bottomLeft', { which: 1 })
      .trigger('mouseup', 'bottomLeft', { force: true });

    cy.get('body').type('{shift}', { release: true });
  });

  it('adds two nodes', () => {
    cy.contains('add node').click();
    cy.contains('add node').click();
  });

  it('connects nodes', () => {
    cy.get('.react-flow__node').first().find('.react-flow__handle.source').trigger('mousedown', { button: 0 });

    cy.get('.react-flow__node')
      .last()
      .find('.react-flow__handle.target')
      .trigger('mousemove')
      .trigger('mouseup', { force: true });

    cy.get('.react-flow__edge').should('have.length', 1);
  });
});

describe('Advanced Flow Rendering', () => {
  it('renders a flow with sone nodes', () => {
    cy.visit('/advanced.html');

    cy.get('.react-flow__renderer');

    cy.get('.react-flow__node').should('have.length', 9);
    cy.get('.react-flow__edge').should('have.length', 9);
  });

  it('renders a grid', () => {
    cy.get('.react-flow__grid');

    const gridStroke = Cypress.$('.react-flow__grid path').attr('stroke');
    expect(gridStroke).to.equal('#aaa');
  });

  it('connects nodes', () => {
    cy.get('.react-flow__node')
      .contains('1 Tests')
      .find('.react-flow__handle.source')
      .trigger('mousedown', { which: 1 });

    cy.get('.react-flow__node')
      .contains('7 output')
      .find('.react-flow__handle.target')
      .trigger('mousemove')
      .should('have.class', 'connecting')
      .should('have.class', 'valid')
      .trigger('mouseup', { force: true })
      .should('not.have.class', 'valid')
      .should('not.have.class', 'connecting');

    cy.get('.react-flow__edge').should('have.length', 10);
  });

  it('tries to make invalid connection', () => {
    cy.get('.react-flow__node')
      .contains('write something')
      .parents('.react-flow__node')
      .find('.react-flow__handle.source')
      .trigger('mousedown', { which: 1 });

    cy.get('.react-flow__node')
      .contains('5 Another node')
      .find('.react-flow__handle.target')
      .trigger('mousemove')
      .should('have.class', 'connecting')
      .should('not.have.class', 'valid')
      .trigger('mouseup', { force: true })
      .should('not.have.class', 'connecting');

    cy.get('.react-flow__edge').should('have.length', 10);
  });
});

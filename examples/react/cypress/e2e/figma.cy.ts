describe('Figma Flow UI', { testIsolation: false }, () => {
  before(() => {
    cy.visit('/figma');
  });

  it('renders a flow with three nodes', () => {
    cy.get('.react-flow__renderer');
    cy.get('.react-flow__node').should('have.length', 4);
    cy.get('.react-flow__edge').should('have.length', 2);
    cy.get('.react-flow__node').children('.react-flow__handle');
  });

  it('renders a grid', () => {
    cy.get('.react-flow__background');
  });

  it('selects all nodes by drag', () => {
    cy.window().then((win) => {
      cy.get('.react-flow__pane')
        .trigger('mousedown', 'topLeft', { button: 0, view: win })
        .trigger('mousemove', 'bottomRight', { force: true })
        .wait(50)
        .trigger('mouseup', { force: true, view: win })
        .then(() => {
          cy.get('.react-flow__node').should('have.class', 'selected');
        });
    });
  });

  it('removes selection', () => {
    cy.get('.react-flow__pane').click('topLeft');
    cy.get('.react-flow__node').should('not.have.class', 'selected');
  });

  it('drags using right click', () => {
    cy.window().then((win) => {
      cy.get('.react-flow__node:last').isWithinViewport();
      cy.get('.react-flow__pane')
        .trigger('mousedown', 'center', { button: 2, view: win })
        .trigger('mousemove', 'bottom', { force: true })
        .wait(50)
        .trigger('mouseup', { force: true, view: win })
        .then(() => {
          cy.get('.react-flow__node').should('not.have.class', 'selected');
          cy.get('.react-flow__node:last').isOutsideViewport();
        });
    });
  });
});

export {};

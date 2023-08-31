describe('Controls Testing', { testIsolation: false }, () => {
  before(() => {
    cy.visit('/');
  });

  it('renders the control panel', () => {
    cy.get('.react-flow__controls');
  });

  it('zooms in', () => {
    const styleBeforeZoom = Cypress.$('.react-flow__viewport').css('transform');

    cy.get('.react-flow__controls-zoomin')
      .click()
      .then(() => {
        const styleAfterZoom = Cypress.$('.react-flow__viewport').css('transform');
        expect(styleBeforeZoom).to.not.equal(styleAfterZoom);
      });
  });

  it('zooms out', () => {
    const styleBeforeZoom = Cypress.$('.react-flow__viewport').css('transform');

    cy.get('.react-flow__controls-zoomout')
      .click()
      .then(() => {
        const styleAfterZoom = Cypress.$('.react-flow__viewport').css('transform');
        expect(styleBeforeZoom).to.not.equal(styleAfterZoom);
      });
  });

  // view is already fitted so we drag the pane to un-fit it
  it('drags the pane', () => {
    const styleBeforeDrag = Cypress.$('.react-flow__viewport').css('transform');

    // for d3 we have to pass the window to the event
    // https://github.com/cypress-io/cypress/issues/3441
    cy.window().then((win) => {
      cy.get('.react-flow__renderer')
        .trigger('mousedown', 'topLeft', { button: 0, view: win })
        .trigger('mousemove', 10, 400)
        .wait(50)
        .trigger('mouseup', 10, 400, { force: true, view: win })
        .then(() => {
          const styleAfterDrag = Cypress.$('.react-flow__viewport').css('transform');
          expect(styleBeforeDrag).to.not.equal(styleAfterDrag);
        });
    });
  });

  it('fits view', () => {
    const styleBeforeZoom = Cypress.$('.react-flow__viewport').css('transform');

    cy.get('.react-flow__controls-fitview')
      .click()
      .then(() => {
        const styleAfterZoom = Cypress.$('.react-flow__viewport').css('transform');
        expect(styleBeforeZoom).to.not.equal(styleAfterZoom);
      });
  });

  it('uses interactive control - not interactive', () => {
    cy.get('.react-flow__node:first').click().should('have.class', 'selected');
    cy.get('.react-flow__pane').click('topLeft');
    cy.get('.react-flow__node:first').should('not.have.class', 'selected');

    cy.get('.react-flow__controls-interactive')
      .click()
      .then(() => {
        cy.get('.react-flow__node:first').should('not.have.class', 'selected');
      });
  });

  it('uses interactive control - interactive', () => {
    cy.get('.react-flow__controls-interactive')
      .click()
      .then(() => {
        cy.get('.react-flow__node:first').click({ force: true }).should('have.class', 'selected');
      });
  });
});

export {};

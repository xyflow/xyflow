describe('Controls Testing', () => {
  before(() => {
    cy.visit('/');
  });

  it('renders the control panel', () => {
    cy.get('.react-flow__controls');
  });

  it('zooms in', () => {
    const styleBeforeZoom = Cypress.$('.react-flow__nodes').css('transform');

    cy.get('.react-flow__controls-zoomin')
      .click()
      .then(() => {
        const styleAfterZoom = Cypress.$('.react-flow__nodes').css('transform');
        expect(styleBeforeZoom).to.not.equal(styleAfterZoom);
      });
  });

  it('zooms out', () => {
    const styleBeforeZoom = Cypress.$('.react-flow__nodes').css('transform');

    cy.get('.react-flow__controls-zoomout')
      .click()
      .then(() => {
        const styleAfterZoom = Cypress.$('.react-flow__nodes').css('transform');
        expect(styleBeforeZoom).to.not.equal(styleAfterZoom);
      });
  });

  // view is already fitted so we drag the pane to un-fit it
  it('drags the pane', () => {
    const styleBeforeDrag = Cypress.$('.react-flow__nodes').css('transform');

    // for d3 we have to pass the window to the event
    // https://github.com/cypress-io/cypress/issues/3441
    cy.window().then((win) => {
      cy.get('.react-flow__zoompane')
        .trigger('mousedown', 'topLeft', { which: 1, view: win })
        .trigger('mousemove', 'bottomLeft')
        .trigger('mouseup', { force: true, view: win })
        .then(() => {
          const styleAfterDrag = Cypress.$('.react-flow__nodes').css('transform');
          expect(styleBeforeDrag).to.not.equal(styleAfterDrag);
        });
    });
  });

  it('fits view', () => {
    const styleBeforeZoom = Cypress.$('.react-flow__nodes').css('transform');

    cy.get('.react-flow__controls-fitview')
      .click()
      .then(() => {
        const styleAfterZoom = Cypress.$('.react-flow__nodes').css('transform');
        expect(styleBeforeZoom).to.not.equal(styleAfterZoom);
      });
  });

  it('uses interactive control - not interactive', () => {
    cy.get('.react-flow__node:first').click().should('have.class', 'selected');
    cy.get('.react-flow__renderer').click('bottomRight');
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
        cy.get('.react-flow__node:first').click().should('have.class', 'selected');
      });
  });
});

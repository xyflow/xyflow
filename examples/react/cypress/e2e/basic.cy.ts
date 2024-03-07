describe('Basic Flow Rendering', { testIsolation: false }, () => {
  before(() => {
    cy.visit('/');
  });

  it('renders a flow with three nodes', () => {
    cy.get('.react-flow__renderer');
    cy.get('.react-flow-basic-example'); // check if className prop works
    cy.get('.react-flow__node').should('have.length', 4);
    cy.get('.react-flow__edge').should('have.length', 2);
    cy.get('.react-flow__node').children('.react-flow__handle');
  });

  it('renders a grid', () => {
    cy.get('.react-flow__background');
  });

  it('selects two nodes by clicks', () => {
    cy.get('body').type('{cmd}', { release: false });
    cy.get('.react-flow__node:first')
      .click()
      .should('have.class', 'selected')
      .get('.react-flow__node:last')
      .click()
      .should('have.class', 'selected')
      .get('.react-flow__node:first')
      .should('have.class', 'selected');
    cy.get('body').type('{cmd}', { release: true });
  });

  it('selects a node by click', () => {
    cy.get('.react-flow__node:first').as('node').click({ force: true }).should('have.class', 'selected');
  });

  it('deselects node', () => {
    cy.get('.react-flow__renderer').click('bottomLeft');
    cy.get('.react-flow__node:first').should('not.have.class', 'selected');
  });

  it('selects an edge by click', () => {
    cy.get('.react-flow__edge:first').as('edge').click({ force: true });
    cy.get('.react-flow__edge:first').should('have.class', 'selected');
  });

  it('deselects edge', () => {
    cy.get('.react-flow__renderer').click('bottomLeft');
    cy.get('.react-flow__edge:first').should('not.have.class', 'selected');
  });

  it('selects one node with a selection', () => {
    cy.get('body')
      .type('{Shift}', { release: false })
      .get('.react-flow__pane')
      .trigger('mousedown', 1, 10, { button: 0, force: true })
      .trigger('mousemove', 1000, 200, { button: 0 })
      .trigger('mouseup', 1000, 200, { button: 0 });

    cy.get('.react-flow__node').eq(0).should('have.class', 'selected');
    cy.get('.react-flow__node').eq(3).should('have.not.class', 'selected');

    cy.get('.react-flow__nodesselection-rect');
    cy.get('body').type('{shift}', { release: true, force: true });
  });

  it('selects all nodes', () => {
    cy.get('body')
      .type('{shift}', { release: false })
      .get('.react-flow__pane')
      .trigger('mousedown', 'topRight', { button: 0, force: true })
      .trigger('mousemove', 'bottomLeft', { button: 0 })
      .wait(50)
      .trigger('mouseup', 'bottomLeft', { button: 0, force: true })
      .wait(400)
      .get('.react-flow__node')
      .should('have.class', 'selected');

    cy.wait(200);
    cy.get('.react-flow__nodesselection-rect');

    cy.get('body').type('{shift}', { release: true, force: true });
  });

  it('removes selection', () => {
    cy.get('.react-flow__renderer').click('bottomLeft');
    cy.get('.react-flow__nodesselection-rect').should('not.exist');
  });

  it('selects an edge', () => {
    cy.get('.react-flow__edge:first').click({ force: true }).should('have.class', 'selected');
  });

  it('drags a node', () => {
    const styleBeforeDrag = Cypress.$('.react-flow__node:first').css('transform');

    cy.drag('.react-flow__node:first', { x: 10, y: 10 }).then(($el: any) => {
      const styleAfterDrag = $el.css('transform');
      expect(styleBeforeDrag).to.not.equal(styleAfterDrag);
    });
  });

  it('removes a node', () => {
    cy.get('.react-flow__node').contains('Node 1').click().should('have.class', 'selected');
    cy.get('html').realPress('Backspace');

    cy.get('.react-flow__node').should('have.length', 3);
    cy.get('.react-flow__edge').should('have.length', 0);
  });

  it('connects nodes', () => {
    cy.get('.react-flow__node')
      .contains('Node 3')
      .find('.react-flow__handle.source')
      .trigger('mousedown', { force: true, button: 0 });

    cy.get('.react-flow__node')
      .contains('Node 4')
      .find('.react-flow__handle.target')
      .trigger('mousemove', { force: true, button: 0 })
      .wait(200)
      .trigger('mouseup', { force: true, button: 0 });

    cy.get('.react-flow__edge').as('edge');
    cy.get('@edge').should('have.length', 1);
  });

  it('removes an edge', () => {
    cy.get('.react-flow__edge:first').click();
    cy.get('html').realPress('Backspace');

    cy.get('.react-flow__edge').should('have.length', 0);
  });

  it('drags the pane', () => {
    const styleBeforeDrag = Cypress.$('.react-flow__viewport').css('transform');

    // for d3 we have to pass the window to the event
    // https://github.com/cypress-io/cypress/issues/3441
    cy.window().then((win) => {
      cy.get('.react-flow__pane')
        .trigger('mousedown', 'topLeft', { button: 0, view: win })
        .trigger('mousemove', 'bottomLeft')
        .wait(50)
        .trigger('mouseup', { force: true, view: win })
        .then(() => {
          const styleAfterDrag = Cypress.$('.react-flow__viewport').css('transform');
          expect(styleBeforeDrag).to.not.equal(styleAfterDrag);
        });
    });
  });

  it('zooms the pane', () => {
    const styleBeforeZoom = Cypress.$('.react-flow__viewport').css('transform');

    cy.get('.react-flow__pane')
      .trigger('wheel', 'topLeft', { deltaY: -200 })
      .wait(50)
      .then(() => {
        const styleAfterZoom = Cypress.$('.react-flow__viewport').css('transform');
        expect(styleBeforeZoom).to.not.equal(styleAfterZoom);
      });
  });
});

export {};

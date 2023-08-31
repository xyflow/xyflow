describe('Minimap Testing', { testIsolation: false }, () => {
  before(() => {
    cy.visit('/');
  });

  it('renders the mini map', () => {
    cy.get('.react-flow__minimap');
    cy.get('.react-flow__minimap-mask');
  });

  it('has same number of nodes as the pane', () => {
    cy.get('.react-flow__minimap-node').then(() => {
      const paneNodes = Cypress.$('.react-flow__node').length;
      const minimapNodes = Cypress.$('.react-flow__minimap-node').length;

      expect(paneNodes).equal(minimapNodes);
    });
  });

  it('changes zoom level', () => {
    const viewBoxBeforeZoom = Cypress.$('.react-flow__minimap svg').attr('viewBox');
    const maskPathBeforeZoom = Cypress.$('.react-flow__minimap-mask').attr('d');

    cy.get('.react-flow__pane')
      .trigger('wheel', 'topLeft', { deltaY: -200 })
      .wait(50)
      .then(() => {
        const viewBoxAfterZoom = Cypress.$('.react-flow__minimap svg').attr('viewBox');
        const maskPathAfterZoom = Cypress.$('.react-flow__minimap-mask').attr('d');

        expect(viewBoxBeforeZoom).to.not.equal(viewBoxAfterZoom);
        expect(maskPathBeforeZoom).to.not.equal(maskPathAfterZoom);
      });
  });

  it('changes node position', () => {
    const minimapNode = Cypress.$('.react-flow__minimap-node:first');

    const xPosBeforeDrag = Number(minimapNode.attr('x'));
    const yPosBeforeDrag = Number(minimapNode.attr('y'));

    cy.drag('.react-flow__node:first', { x: 500, y: 25 })
      .wait(100)
      .then(() => {
        const xPosAfterDrag = Number(minimapNode.attr('x'));
        const yPosAfterDrag = Number(minimapNode.attr('y'));

        expect(xPosAfterDrag).not.to.equal(xPosBeforeDrag);
        expect(yPosAfterDrag).not.to.equal(yPosBeforeDrag);
        expect(xPosAfterDrag - xPosBeforeDrag).to.be.greaterThan(yPosAfterDrag - yPosBeforeDrag);
      });
  });

  it('changes node positions via pane drag', () => {
    const viewBoxBeforeDrag = Cypress.$('.react-flow__minimap svg').attr('viewBox');
    const maskPathBeforeDrag = Cypress.$('.react-flow__minimap-mask').attr('d');

    // for d3 we have to pass the window to the event
    // https://github.com/cypress-io/cypress/issues/3441
    cy.window().then((win) => {
      cy.get('.react-flow__pane')
        .trigger('mousedown', 'topLeft', { button: 0, view: win })
        .trigger('mousemove', 'bottomLeft')
        .wait(50)
        .trigger('mouseup', { force: true, view: win })
        .then(() => {
          const viewBoxAfterDrag = Cypress.$('.react-flow__minimap svg').attr('viewBox');
          const maskPathAfterDrag = Cypress.$('.react-flow__minimap-mask').attr('d');

          expect(viewBoxBeforeDrag).to.not.equal(viewBoxAfterDrag);
          expect(maskPathBeforeDrag).to.not.equal(maskPathAfterDrag);
        });
    });
  });
});

export {};

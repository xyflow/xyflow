describe('Minimap Testing', () => {
  before(() => {
    cy.visit('/');
  });

  it('renders the mini map', () => {
    cy.get('.react-flow__minimap');
    cy.get('.react-flow__minimap-mask');
  });

  it('has same number of nodes as the pane', () => {
    const paneNodes = Cypress.$('.react-flow__node').length;
    const minimapNodes = Cypress.$('.react-flow__minimap-node').length;

    expect(paneNodes).equal(minimapNodes);
  });

  it('changes zoom level', () => {
    const viewBoxBeforeZoom = Cypress.$('.react-flow__minimap').attr('viewBox');
    const maskPathBeforeZoom = Cypress.$('.react-flow__minimap-mask').attr('d');

    cy.get('.react-flow__zoompane')
      .trigger('wheel', 'topLeft', { deltaY: -200 })
      .then(() => {
        const viewBoxAfterZoom = Cypress.$('.react-flow__minimap').attr('viewBox');
        const maskPathAfterZoom = Cypress.$('.react-flow__minimap-mask').attr('d');

        expect(viewBoxBeforeZoom).to.not.equal(viewBoxAfterZoom);
        expect(maskPathBeforeZoom).to.not.equal(maskPathAfterZoom);
      });
  });

  it('changes node position', () => {
    const xPosBeforeDrag = Cypress.$('.react-flow__minimap-node:first').attr('x');
    const yPosBeforeDrag = Cypress.$('.react-flow__minimap-node:first').attr('y');
    const maskPathBeforeDrag = Cypress.$('.react-flow__minimap-mask').attr('d');

    cy.drag('.react-flow__node:first', { x: 500, y: 25 }).then(($el) => {
      const xPosAfterDrag = Cypress.$('.react-flow__minimap-node:first').attr('x');
      const yPosAfterDrag = Cypress.$('.react-flow__minimap-node:first').attr('y');
      const maskPathAfterDrag = Cypress.$('.react-flow__minimap-mask').attr('d');

      expect(xPosBeforeDrag).to.not.equal(xPosAfterDrag);
      expect(yPosBeforeDrag).to.not.equal(yPosAfterDrag);
      expect(maskPathBeforeDrag).to.not.equal(maskPathAfterDrag);
    });
  });

  it('changes node positions via pane drag', () => {
    const viewBoxBeforeDrag = Cypress.$('.react-flow__minimap').attr('viewBox');
    const maskPathBeforeDrag = Cypress.$('.react-flow__minimap-mask').attr('d');

    // for d3 we have to pass the window to the event
    // https://github.com/cypress-io/cypress/issues/3441
    cy.window().then((win) => {
      cy.get('.react-flow__zoompane')
        .trigger('mousedown', 'topLeft', { which: 1, view: win })
        .trigger('mousemove', 'bottomLeft')
        .trigger('mouseup', { force: true, view: win })
        .then(() => {
          const viewBoxAfterDrag = Cypress.$('.react-flow__minimap').attr('viewBox');
          const maskPathAfterDrag = Cypress.$('.react-flow__minimap-mask').attr('d');

          expect(viewBoxBeforeDrag).to.not.equal(viewBoxAfterDrag);
          expect(maskPathBeforeDrag).to.not.equal(maskPathAfterDrag);
        });
    });
  });
});

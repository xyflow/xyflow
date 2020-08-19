describe('Interaction Flow Rendering', () => {
  before(() => {
    cy.visit('/interaction');
  });

  it('renders initial flow', () => {
    cy.get('.react-flow__renderer');
    cy.get('.react-flow__node').should('have.length', 4);
    cy.get('.react-flow__edge').should('have.length', 2);
    cy.get('.react-flow__node').children('.react-flow__handle');
  });

  it('tries to select a node by click', () => {
    const pointerEvents = Cypress.$('.react-flow__node:first').css('pointer-events');
    expect(pointerEvents).to.equal('none');
  });

  it('tries to select an edge by click', () => {
    const pointerEvents = Cypress.$('.react-flow__edge:first').css('pointer-events');
    expect(pointerEvents).to.equal('none');
  });

  it('toggles on capture element click', () => {
    cy.get('.react-flow__captureelementclick').click();
  });

  it('allows node clicks when enabled', () => {
    const pointerEvents = Cypress.$('.react-flow__node:first').css('pointer-events');
    expect(pointerEvents).to.equal('all');
  });

  it('allows edge clicks when enabled', () => {
    const pointerEvents = Cypress.$('.react-flow__edge:first').css('pointer-events');
    expect(pointerEvents).to.equal('all');
  });

  it('tries to do a selection', () => {
    cy.get('body').type('{shift}', { release: false }).get('.react-flow__selectionpane').should('not.exist');
    cy.get('body').type('{shift}', { release: true });
  });

  it('tries to connect to nodes', () => {
    cy.get('.react-flow__node')
      .contains('Node 3')
      .find('.react-flow__handle.source')
      .then(($el) => {
        const pointerEvents = $el.css('pointer-events');
        expect(pointerEvents).to.equal('none');
      });
  });

  it('tries to zoom by scroll', () => {
    const styleBeforeZoom = Cypress.$('.react-flow__nodes').css('transform');

    cy.get('.react-flow__zoompane')
      .dblclick()
      .then(() => {
        const styleAfterZoom = Cypress.$('.react-flow__nodes').css('transform');
        expect(styleBeforeZoom).to.equal(styleAfterZoom);
      });
  });

  it('tries to zoom by double click', () => {
    const styleBeforeZoom = Cypress.$('.react-flow__nodes').css('transform');

    cy.get('.react-flow__zoompane')
      .trigger('wheel', 'topLeft', { deltaY: -200 })
      .then(() => {
        const styleAfterZoom = Cypress.$('.react-flow__nodes').css('transform');
        expect(styleBeforeZoom).to.equal(styleAfterZoom);
      });
  });

  it('toggles draggable mode', () => {
    cy.get('.react-flow__draggable').click();
  });

  it('drags a node', () => {
    const styleBeforeDrag = Cypress.$('.react-flow__node:first').css('transform');

    cy.drag('.react-flow__node:first', { x: 325, y: 100 }).then(($el) => {
      const styleAfterDrag = $el.css('transform');
      expect(styleBeforeDrag).to.not.equal(styleAfterDrag);
    });
  });

  it('toggles selectable mode', () => {
    cy.get('.react-flow__selectable').click();
  });

  it('selects a node by click', () => {
    cy.get('.react-flow__node:first').click().should('have.class', 'selected');
  });

  it('selects an edge by click', () => {
    cy.get('.react-flow__edge:first').click().should('have.class', 'selected');
  });

  it('toggles connectable mode', () => {
    cy.get('.react-flow__connectable').click();
  });

  it('connects two nodes', () => {
    cy.get('.react-flow__node')
      .contains('Node 3')
      .find('.react-flow__handle.source')
      .trigger('mousedown', { which: 1 });

    cy.get('.react-flow__node')
      .contains('Node 4')
      .find('.react-flow__handle.target')
      .trigger('mousemove')
      .trigger('mouseup', { force: true });

    cy.get('.react-flow__edge').should('have.length', 3);
  });

  it('toggles zoom on scroll', () => {
    cy.get('.react-flow__zoomonscroll').click();
  });

  it('zooms by scroll', () => {
    const styleBeforeZoom = Cypress.$('.react-flow__nodes').css('transform');

    cy.get('.react-flow__zoompane')
      .trigger('wheel', 'topLeft', { deltaY: 200 })
      .then(() => {
        const styleAfterZoom = Cypress.$('.react-flow__nodes').css('transform');
        expect(styleBeforeZoom).not.to.equal(styleAfterZoom);
      });
  });

  it('toggles zoom on double click', () => {
    cy.get('.react-flow__zoomondbl').click();
  });

  it('zooms by double click', () => {
    const styleBeforeZoom = Cypress.$('.react-flow__nodes').css('transform');

    cy.get('.react-flow__zoompane')
      .dblclick()
      .then(() => {
        const styleAfterZoom = Cypress.$('.react-flow__nodes').css('transform');
        expect(styleBeforeZoom).not.to.equal(styleAfterZoom);
      });
  });
});

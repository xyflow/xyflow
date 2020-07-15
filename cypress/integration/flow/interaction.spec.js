describe('Interaction Graph Rendering', () => {
  it('renders a graph', () => {
    cy.visit('/interaction');

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

  it('tries to do a selection', () => {
    cy.get('body').type('{shift}', { release: false }).get('.react-flow__selectionpane').should('not.exist');
    cy.get('body').type('{shift}', { release: true });
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
});

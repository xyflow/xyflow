Cypress.Commands.add('drag', (selector, { x, y }) =>
  cy
    .get(selector)
    .should('be.visible')
    .then(($el) => {
      const { left, top, width, height } = $el[0].getBoundingClientRect();
      const endX = left + width / 2 + x;
      const endY = top + height / 2 + y;
      cy.wrap($el).realMouseDown();
      cy.get('body').realMouseMove(left + width / 2 + x / 2, top + height / 2 + y / 2);
      cy.get('body').realMouseMove(endX, endY).wait(50).realMouseUp({ x: endX, y: endY });
      return cy.wrap($el);
    })
);

Cypress.Commands.add('dragPane', ({ from, to }) =>
  cy
    .window()
    .then((window) =>
      cy
        .get('.react-flow__pane')
        .trigger('mousedown', from.x, from.y, { view: window })
        .trigger('mousemove', to.x, to.y)
        .trigger('mouseup', { force: true, view: window })
    )
);

Cypress.Commands.add('zoomPane', (wheelDelta: number) =>
  cy.get('.react-flow__pane').trigger('wheel', 'center', { deltaY: wheelDelta }).wait(250)
);

Cypress.Commands.add('isWithinViewport', { prevSubject: true }, (subject) => {
  const rect = subject[0].getBoundingClientRect();

  return cy.window().then((window) => {
    expect(rect.top).to.be.within(0, window.innerHeight);
    expect(rect.right).to.be.within(0, window.innerWidth);
    expect(rect.bottom).to.be.within(0, window.innerHeight);
    expect(rect.left).to.be.within(0, window.innerWidth);

    return subject;
  });
});

Cypress.Commands.add('isOutsideViewport', { prevSubject: true }, (subject) => {
  const rect = subject[0].getBoundingClientRect();

  return cy.window().then((window) => {
    expect(window.innerHeight < rect.top || rect.bottom < 0 || window.innerWidth < rect.left || rect.right < 0).to.be
      .true;

    return subject;
  });
});

export {};

Cypress.Commands.add('connectNodes', (source, target) => {
  cy.get(`.react-flow__node[data-id="${source}"] .react-flow__handle.source`).then(($source) => {
    cy.get(`.react-flow__node[data-id="${target}"] .react-flow__handle.target`).then(($target) => {
      cy.window().then((win) => {
        const from = $source[0].getBoundingClientRect();
        const to = $target[0].getBoundingClientRect();
        const dispatch = (element: EventTarget, type: string, x: number, y: number) =>
          element.dispatchEvent(
            new win.MouseEvent(type, {
              bubbles: true,
              cancelable: true,
              view: win,
              button: 0,
              buttons: type === 'mouseup' ? 0 : 1,
              clientX: x,
              clientY: y,
            })
          );
        const x = from.left + from.width / 2;
        const y = from.top + from.height / 2;
        dispatch($source[0], 'mousedown', x, y);
        dispatch(win.document, 'mousemove', x + 5, y + 5);
        dispatch(win.document, 'mousemove', to.left + to.width / 2, to.top + to.height / 2);
        dispatch(win.document, 'mouseup', to.left + to.width / 2, to.top + to.height / 2);
      });
    });
  });
});

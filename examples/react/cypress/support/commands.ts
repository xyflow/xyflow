Cypress.Commands.add('drag', (selector, { x, y }) =>
  cy.window().then((window) => {
    const elementToDrag = cy.get(selector as string);
    return elementToDrag.then(($el) => {
      const { left, top, width, height } = $el[0].getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const nextX: number = centerX + x;
      const nextY: number = centerY + y;

      return elementToDrag
        .trigger('mousedown', { view: window, force: true })
        .trigger('mousemove', nextX, nextY, { force: true })
        .wait(50)
        .trigger('mouseup', { view: window, force: true });
    });
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

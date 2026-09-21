import './commands';

// Use iframe-local coordinates; native mouse coordinates can be scaled by the component runner.
Cypress.Commands.overwrite('drag', (_original, selector, { x, y }) =>
  cy.get(selector).should('be.visible').then(($el) =>
    cy.window().then((win) => {
      const { left, top, width, height } = $el[0].getBoundingClientRect();
      const startX = left + width / 2;
      const startY = top + height / 2;
      cy.wrap($el).trigger('mousedown', {
        view: win, button: 0, buttons: 1, clientX: startX, clientY: startY,
      });
      cy.document()
        .trigger('mousemove', { view: win, buttons: 1, clientX: startX + x / 2, clientY: startY + y / 2 }).wait(50)
        .trigger('mousemove', { view: win, buttons: 1, clientX: startX + x, clientY: startY + y }).wait(50)
        .trigger('mouseup', { view: win, button: 0, clientX: startX + x, clientY: startY + y });
      return cy.wrap($el);
    })
  )
);

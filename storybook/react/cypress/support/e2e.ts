import './commands';
import 'cypress-real-events/support';

// Ignore only the browser's benign ResizeObserver delivery warning.
Cypress.on('uncaught:exception', (error) => {
  if (/ResizeObserver loop (limit exceeded|completed with undelivered notifications)/.test(error.message)) {
    return false;
  }
});

Cypress.Commands.add('visitStory', (id) => {
  cy.visit(`/iframe.html?id=${id}&viewMode=story`);
  cy.get('.react-flow__renderer').should('be.visible');
});

// Use the same channel as Storybook's controls, keeping the mounted flow's state.
Cypress.Commands.add('updateStoryArgs', (updatedArgs) => {
  cy.window().then((win) => {
    const storyId = new URL(win.location.href).searchParams.get('id');
    const channel = (
      win as unknown as {
        __STORYBOOK_ADDONS_CHANNEL__: { emit: (event: string, payload: unknown) => void };
      }
    ).__STORYBOOK_ADDONS_CHANNEL__;
    channel.emit('updateStoryArgs', { storyId, updatedArgs });
  });
});

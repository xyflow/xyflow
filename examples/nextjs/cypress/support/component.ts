// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/react18';
import { XYPosition } from '@react-flow/bundle';

import '../../styles/globals.css';
import '../../styles/rf-style.css';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      drag: (selector: string, toPosition: XYPosition) => Cypress.Chainable<JQuery<HTMLElement>>;
      dragPane: ({ from, to }: { from: XYPosition; to: XYPosition }) => Cypress.Chainable<JQuery<HTMLElement>>;
      zoomPane: (wheelDelta: number) => Cypress.Chainable<JQuery<HTMLElement>>;
      isWithinViewport: () => Cypress.Chainable<JQuery<HTMLElement>>;
      isOutsideViewport: () => Cypress.Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('mount', mount);

// Example use:
// cy.mount(<MyComponent />)

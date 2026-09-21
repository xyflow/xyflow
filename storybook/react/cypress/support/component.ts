import './component-commands';
import 'cypress-real-events/support';
import { mount } from 'cypress/react';
import '@xyflow/react/dist/style.css';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);

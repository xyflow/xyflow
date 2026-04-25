import { modifier } from 'ember-modifier';

import type { Edge } from '../types.js';
import type { EmberFlowController } from '../store/controller.js';
import { registerFlowController, unregisterFlowController } from '../store/controller.js';

export default modifier<Element, [EmberFlowController<Edge>]>((element, [controller]) => {
  registerFlowController(element, controller);

  return () => {
    unregisterFlowController(element);
  };
});

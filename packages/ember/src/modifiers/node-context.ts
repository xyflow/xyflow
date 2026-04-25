import { modifier } from 'ember-modifier';

import { registerNodeId, unregisterNodeId } from '../store/node-context.js';

export default modifier<HTMLElement, [string]>((element, [nodeId]) => {
  registerNodeId(element, nodeId);

  return () => {
    unregisterNodeId(element);
  };
});

import { modifier } from 'ember-modifier';

import { getNodeId } from '../store/node-context.js';

type NodeContextOwner = {
  registerNodeContext(element: HTMLElement): void;
  unregisterNodeContext(): void;
};

export default modifier<HTMLElement, [NodeContextOwner]>((element, [owner]) => {
  let frame = requestAnimationFrame(() => owner.registerNodeContext(element));

  return () => {
    cancelAnimationFrame(frame);
    owner.unregisterNodeContext();
  };
});

export { getNodeId };

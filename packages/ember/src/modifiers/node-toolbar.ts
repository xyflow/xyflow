import { modifier } from 'ember-modifier';

type NodeToolbarOwner = {
  registerNodeToolbar(element: HTMLElement): void;
  unregisterNodeToolbar(): void;
};

export default modifier<HTMLElement, [NodeToolbarOwner]>((element, [owner]) => {
  owner.registerNodeToolbar(element);

  return () => {
    owner.unregisterNodeToolbar();
  };
});

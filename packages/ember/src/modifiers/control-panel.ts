import { modifier } from 'ember-modifier';

type ControlPanelOwner = {
  registerControlPanel(element: HTMLElement): void;
  unregisterControlPanel(): void;
};

export default modifier<HTMLElement, [ControlPanelOwner]>((element, [owner]) => {
  owner.registerControlPanel(element);
  let frame = requestAnimationFrame(() => owner.registerControlPanel(element));

  return () => {
    cancelAnimationFrame(frame);
    owner.unregisterControlPanel();
  };
});

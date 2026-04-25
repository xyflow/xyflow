import { modifier } from 'ember-modifier';

type MiniMapOwner = {
  registerMiniMap(element: HTMLElement): void;
  unregisterMiniMap(): void;
};

export default modifier<HTMLElement, [MiniMapOwner]>((element, [owner]) => {
  owner.registerMiniMap(element);
  let frame = requestAnimationFrame(() => owner.registerMiniMap(element));

  return () => {
    cancelAnimationFrame(frame);
    owner.unregisterMiniMap();
  };
});

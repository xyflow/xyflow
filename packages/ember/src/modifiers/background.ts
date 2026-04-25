import { modifier } from 'ember-modifier';

type BackgroundOwner = {
  registerBackground(element: SVGSVGElement): void;
  unregisterBackground(): void;
};

export default modifier<SVGSVGElement, [BackgroundOwner]>((element, [owner]) => {
  owner.registerBackground(element);
  let frame = requestAnimationFrame(() => owner.registerBackground(element));

  return () => {
    cancelAnimationFrame(frame);
    owner.unregisterBackground();
  };
});

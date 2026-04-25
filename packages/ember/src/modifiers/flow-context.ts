import { modifier } from 'ember-modifier';

type FlowContextOwner = {
  registerFlowContext(element: HTMLElement): void;
  unregisterFlowContext(): void;
};

export default modifier<HTMLElement, [FlowContextOwner]>((element, [owner]) => {
  owner.registerFlowContext(element);
  let frame = requestAnimationFrame(() => owner.registerFlowContext(element));

  return () => {
    cancelAnimationFrame(frame);
    owner.unregisterFlowContext();
  };
});

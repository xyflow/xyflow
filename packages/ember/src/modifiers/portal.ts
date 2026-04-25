import { modifier } from 'ember-modifier';

export default modifier<HTMLElement, [string]>((element, [targetSelector]) => {
  let frame = requestAnimationFrame(() => {
    let root = element.closest('.ember-flow');
    let target = root?.querySelector<HTMLElement>(targetSelector);

    if (target && element.parentElement !== target) {
      target.appendChild(element);
    }
  });

  return () => {
    cancelAnimationFrame(frame);
    element.remove();
  };
});

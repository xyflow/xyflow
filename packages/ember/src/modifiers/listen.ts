import { modifier } from 'ember-modifier';

type EventHandler = (event: any) => void;

export default modifier<Element, [string, EventHandler]>(
  (element, [eventName, handler]) => {
    let listener = handler as EventListener;

    element.addEventListener(eventName, listener);

    return () => {
      element.removeEventListener(eventName, listener);
    };
  },
);

import type EmberFlowStore from './index.js';

const storeByElement = new WeakMap<Element, EmberFlowStore>();

export function registerFlowStore(element: Element, store: EmberFlowStore) {
  storeByElement.set(element, store);
}

export function unregisterFlowStore(element: Element) {
  storeByElement.delete(element);
}

export function getFlowStore(element: Element): EmberFlowStore | undefined {
  let current: Element | null = element;

  while (current) {
    let store = storeByElement.get(current);

    if (store) {
      return store;
    }

    current = current.parentElement;
  }

  return undefined;
}

import type EmberFlowStore from './index.js';
import type { Edge, Node } from '../types.js';

const storeByElement = new WeakMap<Element, EmberFlowStore>();

export function registerFlowStore<NodeType extends Node, EdgeType extends Edge>(
  element: Element,
  store: EmberFlowStore<NodeType, EdgeType>
) {
  storeByElement.set(element, store as unknown as EmberFlowStore);
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

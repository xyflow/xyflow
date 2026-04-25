import type { Edge } from '../types.js';

export type EdgeReconnectHandleType = 'source' | 'target';

export interface EmberFlowController<EdgeType extends Edge = Edge> {
  startEdgeReconnect(
    edge: EdgeType,
    handleType: EdgeReconnectHandleType,
    event: PointerEvent,
    fixedElement?: Element | null
  ): void;
}

const controllerByElement = new WeakMap<Element, EmberFlowController>();

export function registerFlowController<EdgeType extends Edge>(
  element: Element,
  controller: EmberFlowController<EdgeType>
) {
  controllerByElement.set(element, controller as EmberFlowController);
}

export function unregisterFlowController(element: Element) {
  controllerByElement.delete(element);
}

export function getFlowController<EdgeType extends Edge>(element: Element): EmberFlowController<EdgeType> | undefined {
  let current: Element | null = element;

  while (current) {
    let controller = controllerByElement.get(current);

    if (controller) {
      return controller as EmberFlowController<EdgeType>;
    }

    current = current.parentElement;
  }

  return undefined;
}

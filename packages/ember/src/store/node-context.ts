const nodeIdByElement = new WeakMap<Element, string>();

export function registerNodeId(element: Element, nodeId: string) {
  nodeIdByElement.set(element, nodeId);
}

export function unregisterNodeId(element: Element) {
  nodeIdByElement.delete(element);
}

export function getNodeId(element: Element): string | null {
  let current: Element | null = element;

  while (current) {
    let nodeId = nodeIdByElement.get(current);

    if (nodeId) {
      return nodeId;
    }

    current = current.parentElement;
  }

  return null;
}

import { useStore } from '$lib/store/index.js';
import type { Edge, Node } from '$lib/types/index.js';
import type { Viewport } from '@xyflow/system';

/**
 * Hook for getting the current nodes from the store.
 *
 * @public
 * @returns A reactive signal of the current nodes
 */
export function useNodes() {
  const store = $derived(useStore());
  return {
    get current() {
      return store.nodes;
    },
    set current(nodes) {
      store.nodes = nodes;
    },
    update(updateFn: (nodes: Node[]) => Node[]) {
      store.queueNodeChanges(getElementChanges(store.nodes, updateFn(store.nodes)));
    },
    set(nodes: Node[]) {
      store.queueNodeChanges(getElementChanges(store.nodes, nodes));
    }
  };
}

/**
 * Hook for getting the current edges from the store.
 *
 * @public
 * @returns A reactive signal of the current edges
 */
export function useEdges() {
  const store = $derived(useStore());
  return {
    get current() {
      return store.edges;
    },
    set current(edges) {
      store.edges = edges;
    },
    update(updateFn: (edges: Edge[]) => Edge[]) {
      store.queueEdgeChanges(getElementChanges(store.edges, updateFn(store.edges)));
    },
    set(edges: Edge[]) {
      store.queueEdgeChanges(getElementChanges(store.edges, edges));
    }
  };
}

/**
 * Hook for getting the current viewport from the store.
 *
 * @public
 * @returns A reactive signal of the current viewport
 */
export function useViewport() {
  const store = $derived(useStore());
  return {
    get current() {
      return store.viewport;
    },
    set current(viewport: Viewport) {
      store.viewport = viewport;
    },
    update(updateFn: (viewport: Viewport) => Viewport) {
      store.viewport = updateFn(store.viewport);
    },
    set(viewport: Viewport) {
      store.viewport = viewport;
    }
  };
}

function getElementChanges<ElementType extends { id: string }>(
  previousElements: ElementType[],
  nextElements: ElementType[]
) {
  const nextElementLookup: Record<string, { element: ElementType; index: number }> = {};
  const changes: Array<
    | { id: string; type: 'remove' }
    | { id: string; type: 'replace'; item: ElementType }
    | { id: string; type: 'add'; item: ElementType; index: number }
  > = [];

  for (const [index, element] of nextElements.entries()) {
    nextElementLookup[element.id] = { element, index };
  }

  for (const previousElement of previousElements) {
    const nextElement = nextElementLookup[previousElement.id];

    if (!nextElement) {
      changes.push({ id: previousElement.id, type: 'remove' });
      continue;
    }

    changes.push({ id: previousElement.id, type: 'replace', item: nextElement.element });
    delete nextElementLookup[previousElement.id];
  }

  for (const { element, index } of Object.values(nextElementLookup)) {
    changes.push({ id: element.id, type: 'add', item: element, index });
  }

  return changes;
}

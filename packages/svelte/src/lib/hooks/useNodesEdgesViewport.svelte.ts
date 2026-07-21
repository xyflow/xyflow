import { useStore } from '$lib/store';
import type { Edge, Node } from '$lib/types';
import type { NodeChange, Viewport } from '@xyflow/system';

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
      store.dispatchNodeChanges(getNodeChanges(store.nodes, updateFn(store.nodes)));
    },
    set(nodes: Node[]) {
      store.dispatchNodeChanges(getNodeChanges(store.nodes, nodes));
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
      // TODO: trigger changes instead ?
      store.edges = updateFn(store.edges);
    },
    set(edges: Edge[]) {
      // TODO: trigger changes instead ?
      store.edges = edges;
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

function getNodeChanges<NodeType extends Node = Node>(
  previousNodes: NodeType[],
  nextNodes: NodeType[]
): NodeChange<NodeType>[] {
  const nextNodeLookup: Record<string, { node: NodeType; index: number }> = {};
  const changes: NodeChange<NodeType>[] = [];

  for (const [index, node] of nextNodes.entries()) {
    nextNodeLookup[node.id] = { node, index };
  }

  for (const previousNode of previousNodes) {
    const nextNode = nextNodeLookup[previousNode.id];

    if (!nextNode) {
      changes.push({ id: previousNode.id, type: 'remove' });
      continue;
    }

    changes.push({ id: previousNode.id, type: 'replace', item: nextNode.node });
    delete nextNodeLookup[previousNode.id];
  }

  for (const { node, index } of Object.values(nextNodeLookup)) {
    changes.push({ id: node.id, type: 'add', item: node, index });
  }

  return changes;
}

import { useStore } from '$lib/store';
import type { Edge, Node } from '$lib/types';
import type { Viewport } from '@xyflow/system';
import { useSvelteFlow } from './useSvelteFlow.svelte';

/**
 * Subscribes to the the nodes inside a Svelte Flow context.
 *
 * @public
 * @returns The current nodes inside a Svelte Flow context
 *
 * @example
 * ```tsx
 *<script>
 *  import { useNodes } from '@xyflow/svelte';
 *  const nodes = useNodes();
 *</script>
 *
 * <div>Nodes: {nodes.current.length}</div>
 *
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
      store.nodes = updateFn(store.nodes);
    },
    set(nodes: Node[]) {
      store.nodes = nodes;
    }
  };
}

/**
 * Subscribes to a specific node inside a Svelte Flow context
 *
 * @param id - The id of the node to get
 * @returns The current node inside a Svelte Flow context
 *
 * @example
 * ```tsx
 *<script>
 *  import { useNode } from '@xyflow/svelte';
 *  const node = useNode('1');
 *</script>
 *
 * <div>Node: {node.current.data.label}</div>
 */
export function useNode<NodeType extends Node = Node>(id: string) {
  const { getNode } = useSvelteFlow<NodeType>();
  const nodes = useNodes();
  const node = $derived.by(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    nodes.current;
    return getNode(id);
  });
  return {
    get current() {
      return node;
    }
  };
}

/**
 * Subscribes to the the edges inside a Svelte Flow context.
 *
 * @public
 * @returns The current edges inside a Svelte Flow context
 *
 * @example
 * ```tsx
 *<script>
 *  import { useEdges } from '@xyflow/svelte';
 *  const edges = useEdges();
 *</script>
 *
 * <div>Edges: {edges.current.length}</div>
 *```
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
      store.edges = updateFn(store.edges);
    },
    set(edges: Edge[]) {
      store.edges = edges;
    }
  };
}

/**
 * Subscribes to a specific edge inside a Svelte Flow context
 *
 * @param id - The id of the edge to get
 * @returns The current edge inside a Svelte Flow context
 *
 * @example
 * ```tsx
 *<script>
 *  import { useEdge } from '@xyflow/svelte';
 *  const edge = useEdge('1');
 *</script>
 *
 * <div>Edge: {edge.current.data.label}</div>
 *```
 */
export function useEdge<EdgeType extends Edge = Edge>(id: string) {
  const { getEdge } = useSvelteFlow<Node, EdgeType>();
  const edges = useEdges();
  const edge = $derived.by(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    edges.current;
    return getEdge(id);
  });
  return {
    get current() {
      return edge;
    }
  };
}
/**
 * Subscribe to the the viewport inside a Svelte Flow context.
 *
 * @public
 * @returns The current viewport inside a Svelte Flow context
 *
 * @example
 * ```tsx
 *<script>
 *  import { useViewport } from '@xyflow/svelte';
 *  const viewport = useViewport();
 *</script>
 *
 * <div>Viewport: {viewport.current.x}, {viewport.current.y}, {viewport.current.zoom}</div>
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

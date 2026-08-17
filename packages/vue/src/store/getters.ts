import type { NodeLookup } from '@xyflow/system';
import type { ComputedGetters, Edge, InternalNode, Node, State } from '../types';
import { getNodesInside, isEdgeVisible } from '@xyflow/system';
import { computed, toRaw } from 'vue';
import { defaultEdgeTypes, defaultNodeTypes } from '../utils/defaultNodesEdges';

/**
 * The type registries are rebuilt whenever `state.nodes`/`state.edges` change
 * (a new array lands on every commit, so on every frame of a drag),
 * but their CONTENT almost never does.
 * Every node's/edge's component lookup depends on the registry,
 * so handing back a fresh object each commit would invalidate all of them and re-resolve every component on every node move.
 * Reuse the previous object when nothing changed.
 */
function sameTypeRegistry(prev: Record<string, any> | undefined, next: Record<string, any>): prev is Record<string, any> {
  if (!prev) {
    return false;
  }

  const prevKeys = Object.keys(prev);

  if (prevKeys.length !== Object.keys(next).length) {
    return false;
  }

  for (const key of prevKeys) {
    if (prev[key] !== next[key]) {
      return false;
    }
  }

  return true;
}

export function useGetters<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: State<NodeType, EdgeType>,
  nodeLookup: NodeLookup<InternalNode<NodeType>>,
): ComputedGetters<NodeType, EdgeType> {
  const getEdgeTypes: ComputedGetters<NodeType, EdgeType>['getEdgeTypes'] = computed((prev) => {
    const edgeTypes: Record<string, any> = {
      ...defaultEdgeTypes,
      ...state.edgeTypes,
    };

    // defaults are not stamped onto stored edges — auto-register defaultEdgeOptions.type too, else
    // edges relying on it would render the bezier default instead of the configured component
    const defaultType = state.defaultEdgeOptions?.type;
    if (defaultType && !(defaultType in edgeTypes)) {
      edgeTypes[defaultType] = defaultType;
    }

    for (const e of toRaw(state.edges)) {
      if (e.type && !(e.type in edgeTypes)) {
        edgeTypes[e.type] = e.type;
      }
    }

    return sameTypeRegistry(prev, edgeTypes) ? prev : edgeTypes;
  });

  const getNodeTypes: ComputedGetters<NodeType>['getNodeTypes'] = computed((prev) => {
    const nodeTypes: Record<string, any> = {
      ...defaultNodeTypes,
      ...state.nodeTypes,
    };

    for (const n of toRaw(state.nodes)) {
      if (n.type && !(n.type in nodeTypes)) {
        nodeTypes[n.type] = n.type;
      }
    }

    return sameTypeRegistry(prev, nodeTypes) ? prev : nodeTypes;
  });

  const getNodes: ComputedGetters<NodeType>['getNodes'] = computed(() => {
    if (state.onlyRenderVisibleElements) {
      // `getNodesInside` works on the InternalNode lookup; surface the user nodes (the public contract)
      return getNodesInside(
        nodeLookup,
        {
          x: 0,
          y: 0,
          width: state.dimensions.width,
          height: state.dimensions.height,
        },
        state.transform,
        true,
      ).map(node => node.internals.userNode);
    }

    return state.nodes;
  });

  const getEdges: ComputedGetters<NodeType, EdgeType>['getEdges'] = computed(() => {
    if (state.onlyRenderVisibleElements) {
      const visibleEdges: EdgeType[] = [];

      for (const edge of state.edges) {
        const source = nodeLookup.get(edge.source);
        const target = nodeLookup.get(edge.target);

        // skip dangling edges (missing endpoint node) instead of crashing on the non-null assertion
        if (!source || !target) {
          continue;
        }

        if (
          isEdgeVisible({
            sourceNode: source,
            targetNode: target,
            width: state.dimensions.width,
            height: state.dimensions.height,
            transform: state.transform,
          })
        ) {
          visibleEdges.push(edge);
        }
      }

      return visibleEdges;
    }

    return state.edges;
  });

  const getSelectedNodes: ComputedGetters<NodeType>['getSelectedNodes'] = computed(() => {
    const selectedNodes: NodeType[] = [];
    // iterate the raw array: reading `state.nodes` already tracks the dependency, while walking the reactive
    // proxy would run Vue's get trap for every element — an O(n) proxy walk on every commit (every drag frame)
    for (const node of toRaw(state.nodes)) {
      if (node.selected) {
        selectedNodes.push(node);
      }
    }

    return selectedNodes;
  });

  const getSelectedEdges: ComputedGetters<NodeType, EdgeType>['getSelectedEdges'] = computed(() => {
    const selectedEdges: EdgeType[] = [];
    // raw iteration — see `getSelectedNodes`
    for (const edge of toRaw(state.edges)) {
      if (edge.selected) {
        selectedEdges.push(edge);
      }
    }

    return selectedEdges;
  });

  // the public `{ x, y, zoom }` shape derived from the canonical `transform` tuple (read-only)
  const viewport: ComputedGetters<NodeType, EdgeType>['viewport'] = computed(() => ({
    x: state.transform[0],
    y: state.transform[1],
    zoom: state.transform[2],
  }));

  return {
    getEdgeTypes,
    getNodeTypes,
    getEdges,
    getNodes,
    getSelectedNodes,
    getSelectedEdges,
    viewport,
  };
}

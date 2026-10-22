import type { NodeLookup } from '@xyflow/system';
import type { ComputedGetters, Edge, InternalNode, Node, State } from '../types';
import { getNodesInside, isEdgeVisible } from '@xyflow/system';
import { computed, toRaw } from 'vue';

export function useGetters<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: State<NodeType, EdgeType>,
  nodeLookup: NodeLookup<InternalNode<NodeType>>,
): ComputedGetters<NodeType, EdgeType> {
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
    getEdges,
    getNodes,
    getSelectedNodes,
    getSelectedEdges,
    viewport,
  };
}

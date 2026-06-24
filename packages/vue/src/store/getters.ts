import type { ComputedGetters, Edge, Node, NodeLookup, State } from '../types';
import { getNodesInside, isEdgeVisible } from '@xyflow/system';
import { computed } from 'vue';
import { defaultEdgeTypes, defaultNodeTypes } from '../utils/defaultNodesEdges';

export function useGetters<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: State<NodeType, EdgeType>,
  nodeLookup: NodeLookup<NodeType>,
): ComputedGetters<NodeType, EdgeType> {
  const getEdgeTypes: ComputedGetters<NodeType, EdgeType>['getEdgeTypes'] = computed(() => {
    const edgeTypes: Record<string, any> = {
      ...defaultEdgeTypes,
      ...state.edgeTypes,
    };

    const keys = Object.keys(edgeTypes);

    // defaults are not stamped onto stored edges — auto-register defaultEdgeOptions.type too, else
    // edges relying on it would render the bezier default instead of the configured component
    const defaultType = state.defaultEdgeOptions?.type;
    if (defaultType && !keys.includes(defaultType)) {
      edgeTypes[defaultType] = defaultType;
      keys.push(defaultType);
    }

    for (const e of state.edges) {
      e.type && !keys.includes(e.type) && (edgeTypes[e.type] = e.type);
    }

    return edgeTypes;
  });

  const getNodeTypes: ComputedGetters<NodeType>['getNodeTypes'] = computed(() => {
    const nodeTypes: Record<string, any> = {
      ...defaultNodeTypes,
      ...state.nodeTypes,
    };

    const keys = Object.keys(nodeTypes);

    for (const n of state.nodes) {
      n.type && !keys.includes(n.type) && (nodeTypes[n.type] = n.type);
    }

    return nodeTypes;
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
    for (const node of state.nodes) {
      if (node.selected) {
        selectedNodes.push(node);
      }
    }

    return selectedNodes;
  });

  const getSelectedEdges: ComputedGetters<NodeType, EdgeType>['getSelectedEdges'] = computed(() => {
    const selectedEdges: EdgeType[] = [];
    for (const edge of state.edges) {
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

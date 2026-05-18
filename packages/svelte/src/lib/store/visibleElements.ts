import type { DefaultEdgeOptions, Node, Edge, EdgeLayouted, InternalNode } from '$lib/types';
import {
  ConnectionMode,
  getEdgePosition,
  getElevatedEdgeZIndex,
  getNodesInside,
  isEdgeVisible,
  type NodeLookup,
  type OnError,
  type Transform,
  type ZIndexMode
} from '@xyflow/system';

export function getVisibleNodes<NodeType extends Node = Node>(
  nodeLookup: NodeLookup<InternalNode<NodeType>>,
  transform: Transform,
  width: number,
  height: number
) {
  const visibleNodes = new Map<string, InternalNode<NodeType>>();
  getNodesInside(nodeLookup, { x: 0, y: 0, width: width, height: height }, transform, true).forEach(
    (node) => {
      visibleNodes.set(node.id, node);
    }
  );
  return visibleNodes;
}

export interface EdgeLayoutBaseOptions<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  edges: EdgeType[];
  defaultEdgeOptions: DefaultEdgeOptions;
  elevateEdgesOnSelect: boolean;
  previousEdges: Map<string, EdgeLayouted<EdgeType>>;
  nodeLookup: NodeLookup<InternalNode<NodeType>>;
  connectionMode: ConnectionMode;
  onerror: OnError;
}

export interface EdgeLayoutAllOptions<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> extends EdgeLayoutBaseOptions<NodeType, EdgeType> {
  onlyRenderVisible: never;
  visibleNodes: never;
  transform: never;
  width: never;
  height: never;
  zIndexMode: never;
}

export interface EdgeLayoutOnlyVisibleOptions<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> extends EdgeLayoutBaseOptions<NodeType, EdgeType> {
  visibleNodes: Map<string, InternalNode>;
  transform: Transform;
  width: number;
  height: number;
  onlyRenderVisible: true;
  zIndexMode: ZIndexMode;
}

export type EdgeLayoutOptions<NodeType extends Node = Node, EdgeType extends Edge = Edge> =
  | EdgeLayoutAllOptions<NodeType, EdgeType>
  | EdgeLayoutOnlyVisibleOptions<NodeType, EdgeType>;

export function getLayoutedEdges<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  options: EdgeLayoutOptions<NodeType, EdgeType>
): Map<string, EdgeLayouted<EdgeType>> {
  const {
    edges,
    defaultEdgeOptions,
    nodeLookup,
    previousEdges,
    connectionMode,
    onerror,
    onlyRenderVisible,
    elevateEdgesOnSelect,
    zIndexMode
  } = options;
  const layoutedEdges = new Map<string, EdgeLayouted<EdgeType>>();
  for (const edge of edges) {
    const sourceNode = nodeLookup.get(edge.source);
    const targetNode = nodeLookup.get(edge.target);

    if (!sourceNode || !targetNode) {
      continue;
    }

    if (onlyRenderVisible) {
      const { visibleNodes, transform, width, height } = options;
      if (
        isEdgeVisible({
          sourceNode,
          targetNode,
          width: width!,
          height: height!,
          transform: transform!
        })
      ) {
        visibleNodes!.set(sourceNode.id, sourceNode);
        visibleNodes!.set(targetNode.id, targetNode);
      } else {
        continue;
      }
    }

    // we reuse the previous edge object if
    // the current and previous edge are the same
    // and the source and target node are the same
    // and references to internalNodes are the same
    const previous = previousEdges.get(edge.id);
    if (
      previous &&
      edge === previous.edge &&
      sourceNode == previous.sourceNode &&
      targetNode == previous.targetNode
    ) {
      layoutedEdges.set(edge.id, previous);
      continue;
    }

    const edgePosition = getEdgePosition({
      id: edge.id,
      sourceNode,
      targetNode,
      sourceHandle: edge.sourceHandle || null,
      targetHandle: edge.targetHandle || null,
      connectionMode,
      onError: onerror
    });

    if (edgePosition) {
      layoutedEdges.set(edge.id, {
        ...defaultEdgeOptions,
        ...edge,
        ...edgePosition,
        zIndex: getElevatedEdgeZIndex({
          selected: edge.selected,
          zIndex: edge.zIndex ?? defaultEdgeOptions.zIndex,
          sourceNode,
          targetNode,
          elevateOnSelect: elevateEdgesOnSelect,
          zIndexMode
        }),
        sourceNode,
        targetNode,
        edge
      });
    }
  }

  return layoutedEdges;
}

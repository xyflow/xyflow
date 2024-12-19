import type { Edge, EdgeLayouted, InternalNode } from '$lib/types';
import {
  ConnectionMode,
  getEdgePosition,
  getElevatedEdgeZIndex,
  getNodesInside,
  isEdgeVisible,
  type NodeLookup,
  type OnError,
  type Transform
} from '@xyflow/system';

export function getVisibleNodes(
  nodeLookup: NodeLookup,
  transform: Transform,
  width: number,
  height: number
) {
  return getNodesInside(nodeLookup, { x: 0, y: 0, width: width, height: height }, transform, true);
}

// TODO: is this what we want?
export function gatherLayoutedEdges(
  edges: Edge[],
  nodeLookup: NodeLookup,
  previousLayoutedEdges: Map<string, EdgeLayouted>,
  connectionMode: ConnectionMode,
  onerror: OnError,
  onlyRenderVisibleElements: true,
  transform: Transform,
  width: number,
  height: number,
  visibleNodes: Map<string, InternalNode>
): Map<string, EdgeLayouted>;
export function gatherLayoutedEdges(
  edges: Edge[],
  nodeLookup: NodeLookup,
  previousLayoutedEdges: Map<string, EdgeLayouted>,
  connectionMode: ConnectionMode,
  onerror: OnError,
  onlyRenderVisibleElements: false
): Map<string, EdgeLayouted>;
export function gatherLayoutedEdges(
  edges: Edge[],
  nodeLookup: NodeLookup,
  previousLayoutedEdges: Map<string, EdgeLayouted>,
  connectionMode: ConnectionMode,
  onerror: OnError,
  onlyRenderVisibleElements?: boolean,
  transform?: Transform,
  width?: number,
  height?: number,
  visibleNodes?: Map<string, InternalNode>
): Map<string, EdgeLayouted> {
  const layoutedEdges = new Map<string, EdgeLayouted>();
  for (const edge of edges) {
    const sourceNode = nodeLookup.get(edge.source);
    const targetNode = nodeLookup.get(edge.target);

    if (!sourceNode || !targetNode) {
      continue;
    }

    if (onlyRenderVisibleElements) {
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
    const previous = previousLayoutedEdges.get(edge.id);
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
      connectionMode: connectionMode,
      onError: onerror
    });

    if (edgePosition) {
      layoutedEdges.set(edge.id, {
        ...edge,
        zIndex: getElevatedEdgeZIndex({
          selected: edge.selected,
          zIndex: edge.zIndex,
          sourceNode,
          targetNode,
          elevateOnSelect: false
        }),
        ...edgePosition,
        sourceNode,
        targetNode,
        edge
      });
    }
  }

  previousLayoutedEdges = layoutedEdges;

  return layoutedEdges;
}

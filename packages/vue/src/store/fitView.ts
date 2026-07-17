import type { NodeLookup } from '@xyflow/system';
import type { Edge, InternalNode, Node, State } from '../types';
import { fitViewport } from '@xyflow/system';

const DEFAULT_PADDING = 0.1;

/**
 * Settle a queued imperative `fitView()` against the current node lookup. Called from the node write paths
 * (`commitNodes`, `updateNodeDimensions`) once the nodes are measured, and from `fitView()` itself for a
 * standalone call that has nothing left to commit. No-op when nothing is queued.
 */
export async function resolveFitView<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: State<NodeType, EdgeType>,
  nodeLookup: NodeLookup<InternalNode<NodeType>>,
): Promise<void> {
  const request = state.fitViewQueued;
  state.fitViewQueued = false;

  if (!request) {
    return;
  }

  if (!state.panZoom) {
    request.resolver.resolve(false);
    return;
  }

  const { options } = request;

  const result = await fitViewport(
    {
      nodes: nodeLookup,
      width: state.dimensions.width,
      height: state.dimensions.height,
      panZoom: state.panZoom,
      minZoom: state.minZoom,
      maxZoom: state.maxZoom,
    },
    {
      padding: options?.padding ?? DEFAULT_PADDING,
      duration: options?.duration,
      ease: options?.ease,
      interpolate: options?.interpolate,
      minZoom: options?.minZoom,
      maxZoom: options?.maxZoom,
      // `fitViewport` forwards these to `getFitViewNodes` at runtime, but its options type `Omit`s them
      ...(options?.includeHiddenNodes ? { includeHiddenNodes: true } : {}),
      ...(options?.nodes?.length ? { nodes: options.nodes } : {}),
    },
  );

  request.resolver.resolve(result);
}

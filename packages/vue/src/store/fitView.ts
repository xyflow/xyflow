import type { NodeLookup, Transform } from '@xyflow/system';
import type { Edge, InternalNode, Node, State } from '../types';
import { defaultFitViewPadding, fitViewport, getInternalNodesBounds, getViewportForBounds } from '@xyflow/system';

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
      padding: options?.padding,
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

/**
 * The transform to start from, computed before the flow has ever been measured. Given `width`/`height`
 * and the `fitView` prop this is the same fit the client would compute, which is what lets a
 * server-rendered flow land in frame instead of at the origin. Otherwise it's `defaultViewport`.
 */
export function getInitialTransform<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: State<NodeType, EdgeType>,
  nodeLookup: NodeLookup<InternalNode<NodeType>>,
  width?: number,
  height?: number,
): Transform {
  if (state.fitViewOnInit && width && height) {
    // only nodes that carry their own dimensions can be bounded without measuring
    const bounds = getInternalNodesBounds(nodeLookup, {
      filter: node => !!((node.width || node.initialWidth) && (node.height || node.initialHeight)),
    });

    const { x, y, zoom } = getViewportForBounds(
      bounds,
      width,
      height,
      state.minZoom,
      state.maxZoom,
      state.fitViewOptions?.padding ?? defaultFitViewPadding,
    );

    return [x, y, zoom];
  }

  const { x = 0, y = 0, zoom = 1 } = state.defaultViewport;

  return [x, y, zoom];
}

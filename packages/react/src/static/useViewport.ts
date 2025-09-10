import { NodeLookup, getInternalNodesBounds, getViewportForBounds } from '@xyflow/system';
import { useMemo } from 'react';
import { FitViewOptions, InternalNode, Node } from '../types';

export function useViewport<NodeType extends Node = Node>({
  nodeLookup,
  width,
  height,
  fitViewOptions,
  minZoom,
  maxZoom,
}: {
  nodeLookup: NodeLookup<InternalNode<NodeType>>;
  width: number;
  height: number;
  fitViewOptions?: FitViewOptions;
  minZoom: number;
  maxZoom: number;
}) {
  const viewport = useMemo(() => {
    const bounds = getInternalNodesBounds(nodeLookup);

    return getViewportForBounds(bounds, width, height, minZoom, maxZoom, fitViewOptions?.padding ?? 0.25);
  }, [nodeLookup, width, height, fitViewOptions, minZoom, maxZoom]);

  return viewport;
}

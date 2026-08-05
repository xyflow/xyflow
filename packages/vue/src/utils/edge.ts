import type { Handle, ZIndexMode } from '@xyflow/system';
import type { Actions, Edge } from '../types';
import { getElevatedEdgeZIndex } from '@xyflow/system';

export function getEdgeHandle(bounds: Handle[] | null, handleId?: string | null): Handle | null {
  if (!bounds) {
    return null;
  }

  // if no handleId is given, we use the first handle, otherwise we check for the id
  return (!handleId ? bounds[0] : bounds.find(d => d.id === handleId)) || null;
}

export function getEdgeZIndex(
  edge: Edge,
  getInternalNode: Actions['getInternalNode'],
  elevateEdgesOnSelect = false,
  zIndexMode: ZIndexMode = 'basic',
) {
  const source = getInternalNode(edge.source);
  const target = getInternalNode(edge.target);

  if (!source || !target) {
    return 0;
  }

  return getElevatedEdgeZIndex({
    sourceNode: source,
    targetNode: target,
    selected: edge.selected ?? false,
    zIndex: typeof edge.zIndex === 'number' ? edge.zIndex : 0,
    elevateOnSelect: elevateEdgesOnSelect,
    zIndexMode,
  });
}

import { useEffect, useRef } from 'react';

import type { InternalNode } from '../../types';
import { useStoreApi } from '../../hooks/useStore';

/**
 * Hook to handle the resize observation + internal updates for the passed node.
 *
 * @internal
 * @returns nodeRef - reference to the node element
 */
export function useNodeObserver({
  node,
  nodeType,
  initialized,
  resizeObserver,
}: {
  node: InternalNode;
  nodeType: string;
  initialized: boolean;
  resizeObserver: ResizeObserver | null;
}) {
  const store = useStoreApi();
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const observedNodeRef = useRef<HTMLDivElement | null>(null);
  const prevSourcePosition = useRef(node.sourcePosition);
  const prevTargetPosition = useRef(node.targetPosition);
  const prevType = useRef(nodeType);
  const hasHandleBounds = !!node.internals.handleBounds;

  useEffect(() => {
    if (
      nodeRef.current &&
      !node.hidden &&
      (!initialized || !hasHandleBounds || observedNodeRef.current !== nodeRef.current)
    ) {
      if (observedNodeRef.current) {
        resizeObserver?.unobserve(observedNodeRef.current);
      }
      resizeObserver?.observe(nodeRef.current);
      observedNodeRef.current = nodeRef.current;
    }
  }, [node.hidden, initialized, hasHandleBounds]);

  useEffect(() => {
    return () => {
      if (observedNodeRef.current) {
        resizeObserver?.unobserve(observedNodeRef.current);
        observedNodeRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // when the user programmatically changes the source or handle position, we need to update the internals
    // to make sure the edges are updated correctly
    const typeChanged = prevType.current !== nodeType;
    const sourcePosChanged = prevSourcePosition.current !== node.sourcePosition;
    const targetPosChanged = prevTargetPosition.current !== node.targetPosition;

    if (nodeRef.current && (typeChanged || sourcePosChanged || targetPosChanged)) {
      prevType.current = nodeType;
      prevSourcePosition.current = node.sourcePosition;
      prevTargetPosition.current = node.targetPosition;

      store
        .getState()
        .updateNodeInternals(new Map([[node.id, { id: node.id, nodeElement: nodeRef.current, force: true }]]));
    }
  }, [node.id, nodeType, node.sourcePosition, node.targetPosition]);

  return nodeRef;
}

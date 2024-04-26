// import { useEffect, useRef } from 'react';

import type { InternalNode } from '../../types';
import { useStoreApi } from '../../hooks/useStore';
import { useRef } from '../../utils/hooks';
import { createEffect, onCleanup } from 'solid-js';

// TODO: this seems wrong - nodeRef is never updated?
/**
 * Hook to handle the resize observation + internal updates for the passed node.
 *
 * @internal
 * @returns nodeRef - reference to the node element
 */
export function useNodeObserver({
  node: getNode,
  nodeType: getNodeType,
  hasDimensions,
  resizeObserver: getResizeObserver,
}: {
  node: () => InternalNode;
  nodeType: () => string;
  hasDimensions: () => boolean;
  resizeObserver: () => ResizeObserver | null;
}) {
  console.log('useNodeObserver called', getNode());
  const store = useStoreApi();
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const observedNode = useRef<HTMLDivElement | null>(null);
  const prevSourcePosition = useRef(getNode().sourcePosition);
  const prevTargetPosition = useRef(getNode().targetPosition);
  const prevType = useRef(getNodeType());
  const resizeObserver = getResizeObserver();
  const isInitialized = () => hasDimensions() && !!getNode().internals.handleBounds && !getNode().hidden;

  createEffect(() => {
    if (nodeRef.current && (!isInitialized() || observedNode.current !== nodeRef.current)) {
      if (observedNode.current) {
        resizeObserver?.unobserve(observedNode.current);
      }
      resizeObserver?.observe(nodeRef.current);
      observedNode.current = nodeRef.current;
    }
  });

  onCleanup(() => {
    if (observedNode.current) {
      resizeObserver?.unobserve(observedNode.current);
      observedNode.current = null;
    }
  });

  createEffect(() => {
    const node = getNode();
    const nodeType = getNodeType();
    if (nodeRef.current) {
      // when the user programmatically changes the source or handle position, we need to update the internals
      // to make sure the edges are updated correctly
      const typeChanged = prevType.current !== nodeType;
      const sourcePosChanged = prevSourcePosition.current !== node.sourcePosition;
      const targetPosChanged = prevTargetPosition.current !== node.targetPosition;

      if (typeChanged || sourcePosChanged || targetPosChanged) {
        prevType.current = nodeType;
        prevSourcePosition.current = node.sourcePosition;
        prevTargetPosition.current = node.targetPosition;

        store.updateNodeInternals(new Map([[node.id, { id: node.id, nodeElement: nodeRef.current, force: true }]]));
      }
    }
  });

  return nodeRef;
}

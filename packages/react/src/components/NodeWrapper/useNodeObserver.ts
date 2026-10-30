import { useEffect, useRef } from 'react';
import { isSkipMeasurementHonored } from '@xyflow/system';

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
  hasDimensions,
  resizeObserver,
}: {
  node: InternalNode;
  nodeType: string;
  hasDimensions: boolean;
  resizeObserver: ResizeObserver | null;
}) {
  const store = useStoreApi();
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const observedNode = useRef<HTMLDivElement | null>(null);
  const prevSourcePosition = useRef(node.sourcePosition);
  const prevTargetPosition = useRef(node.targetPosition);
  const prevType = useRef(nodeType);
  const isInitialized = hasDimensions && !!node.internals.handleBounds;
  /*
   * opt-in, honored only once the app has actually provided the values (dimensions + user `handles`);
   * shared with adoptUserNodes and the Svelte wrapper so all sites agree. Gating on the user-provided
   * `handles` rather than `internals.handleBounds` is deliberate: a measurement only writes
   * `internals.handleBounds`, so a node that opts in without providing `handles` keeps measuring
   * normally instead of getting measured once and then skipping.
   */
  const skipMeasurement = isSkipMeasurementHonored(node);

  useEffect(() => {
    if (skipMeasurement) {
      if (observedNode.current) {
        resizeObserver?.unobserve(observedNode.current);
        observedNode.current = null;
      }
      return;
    }
    if (nodeRef.current && !node.hidden && (!isInitialized || observedNode.current !== nodeRef.current)) {
      if (observedNode.current) {
        resizeObserver?.unobserve(observedNode.current);
      }
      resizeObserver?.observe(nodeRef.current);
      observedNode.current = nodeRef.current;
    }
  }, [skipMeasurement, isInitialized, node.hidden]);

  useEffect(() => {
    return () => {
      if (observedNode.current) {
        resizeObserver?.unobserve(observedNode.current);
        observedNode.current = null;
      }
    };
  }, []);

  useEffect(() => {
    /*
     * a node that opts in provides its own handles, so the edges follow the data; we must not force a
     * DOM read here, otherwise the measurement we skipped on mount comes back on every handle change
     */
    if (skipMeasurement) {
      return;
    }
    if (nodeRef.current) {
      /*
       * when the user programmatically changes the source or handle position, we need to update the internals
       * to make sure the edges are updated correctly
       */
      const typeChanged = prevType.current !== nodeType;
      const sourcePosChanged = prevSourcePosition.current !== node.sourcePosition;
      const targetPosChanged = prevTargetPosition.current !== node.targetPosition;

      if (typeChanged || sourcePosChanged || targetPosChanged) {
        prevType.current = nodeType;
        prevSourcePosition.current = node.sourcePosition;
        prevTargetPosition.current = node.targetPosition;

        store
          .getState()
          .updateNodeInternals(new Map([[node.id, { id: node.id, nodeElement: nodeRef.current, force: true }]]));
      }
    }
  }, [skipMeasurement, node.id, nodeType, node.sourcePosition, node.targetPosition]);

  return nodeRef;
}

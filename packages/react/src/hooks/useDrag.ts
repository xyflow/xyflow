import { useEffect, useRef, useState, type RefObject } from 'react';
import { XYDrag, type XYDragInstance } from '@xyflow/system';

import { handleNodeClick } from '../components/Nodes/utils';
import { useReactFlowStoreApi } from './useReactFlowStore';

type UseDragParams = {
  nodeRef: RefObject<HTMLDivElement>;
  disabled?: boolean;
  noDragClassName?: string;
  handleSelector?: string;
  nodeId?: string;
  isSelectable?: boolean;
  nodeClickDistance?: number;
};

/**
 * Hook for calling XYDrag helper from @xyflow/system.
 *
 * @internal
 */
export function useDrag({
  nodeRef,
  disabled = false,
  noDragClassName,
  handleSelector,
  nodeId,
  isSelectable,
  nodeClickDistance,
}: UseDragParams) {
  const { optionsStore, viewportStore, nodesStore, edgesStore } = useReactFlowStoreApi();
  const [dragging, setDragging] = useState<boolean>(false);
  const xyDrag = useRef<XYDragInstance>();

  useEffect(() => {
    if (disabled) {
      return;
    }

    xyDrag.current = XYDrag({
      getStoreItems: () => {
        const { nodes, nodeLookup } = nodesStore.getState();
        const { edges } = edgesStore.getState();
        const { transform } = viewportStore.getState();
        return { ...optionsStore.getState(), nodes, nodeLookup, edges, transform };
      },
      onNodeMouseDown: (id: string) => {
        handleNodeClick({
          id,
          optionsStore,
          nodesStore,
          nodeRef,
        });
      },
      onDragStart: () => {
        setDragging(true);
      },
      onDragStop: () => {
        setDragging(false);
      },
    });

    return () => {
      xyDrag.current?.destroy();
      xyDrag.current = undefined;
    };
  }, [disabled, optionsStore, viewportStore, nodesStore, edgesStore, nodeRef]);

  useEffect(() => {
    if (disabled || !nodeRef.current || !xyDrag.current) {
      return;
    }

    xyDrag.current.update({
      noDragClassName,
      handleSelector,
      domNode: nodeRef.current,
      isSelectable,
      nodeId,
      nodeClickDistance,
    });
  }, [noDragClassName, handleSelector, disabled, isSelectable, nodeRef, nodeId, nodeClickDistance]);

  return dragging;
}

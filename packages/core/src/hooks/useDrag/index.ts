import { useEffect, useRef, useState, type RefObject } from 'react';
import { XYDrag, type XYDragInstance } from '@reactflow/utils';

import { useStoreApi } from '../../hooks/useStore';
import { handleNodeClick } from '../../components/Nodes/utils';
import useGetPointerPosition from '../useGetPointerPosition';

export type UseDragData = { dx: number; dy: number };

type UseDragParams = {
  nodeRef: RefObject<Element>;
  disabled?: boolean;
  noDragClassName?: string;
  handleSelector?: string;
  nodeId?: string;
  isSelectable?: boolean;
  selectNodesOnDrag?: boolean;
};

function useDrag({
  nodeRef,
  disabled = false,
  noDragClassName,
  handleSelector,
  nodeId,
  isSelectable,
  selectNodesOnDrag,
}: UseDragParams) {
  const store = useStoreApi();
  const [dragging, setDragging] = useState<boolean>(false);
  const getPointerPosition = useGetPointerPosition();
  const xyDrag = useRef<XYDragInstance>();

  useEffect(() => {
    if (nodeRef?.current) {
      xyDrag.current = XYDrag({
        nodeId,
        domNode: nodeRef.current,
        getPointerPosition,
        getStore: () => {
          const currentStore = store.getState();

          return {
            nodes: currentStore.getNodes(),
            ...store.getState(),
          };
        },
        onNodeClick: () => {
          if (nodeId) {
            handleNodeClick({
              id: nodeId,
              store,
              nodeRef: nodeRef as RefObject<HTMLDivElement>,
            });
          }
        },
        onDragStart: () => {
          setDragging(true);
        },
        onDragStop: () => {
          setDragging(false);
        },
      });
    }
  }, [store, getPointerPosition]);

  useEffect(() => {
    if (disabled) {
      xyDrag.current?.destroy();
    } else {
      xyDrag.current?.update({
        noDragClassName,
        handleSelector,
        domNode: nodeRef.current as Element,
        isSelectable,
        selectNodesOnDrag,
      });
      return () => {
        xyDrag.current?.destroy();
      };
    }
  }, [noDragClassName, handleSelector, disabled, isSelectable, selectNodesOnDrag, nodeRef]);

  return dragging;
}

export default useDrag;

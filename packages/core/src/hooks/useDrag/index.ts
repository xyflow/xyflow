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
        getStoreItemsItems: (items: string[]) => {
          const storeItems = store.getState();
          return items.map((item) => storeItems[item]);
        },
        handleNodeClick: () => {
          if (nodeId) {
            handleNodeClick({
              id: nodeId,
              store,
              nodeRef: nodeRef as RefObject<HTMLDivElement>,
            });
          }
        },
        getPointerPosition,
        onDraggingChange: setDragging,
      });
    }
  }, [store, getPointerPosition]);

  useEffect(() => {
    if (disabled) {
      xyDrag.current?.disable();
    } else {
      xyDrag.current?.enable({
        noDragClassName,
        handleSelector,
        domNode: nodeRef.current as Element,
        isSelectable,
        selectNodesOnDrag,
      });
      return () => {
        xyDrag.current?.disable();
      };
    }
  }, [noDragClassName, handleSelector, disabled, isSelectable, selectNodesOnDrag, nodeRef]);

  return dragging;
}

export default useDrag;

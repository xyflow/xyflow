import { useEffect, useRef, useState, type RefObject } from 'react';
import { XYDrag, type XYDragInstance } from '@xyflow/system';

import { handleNodeClick } from '../components/Nodes/utils';
import { useStoreApi } from './useStore';

type UseDragParams = {
  nodeRef: RefObject<Element>;
  disabled?: boolean;
  noDragClassName?: string;
  handleSelector?: string;
  nodeId?: string;
  isSelectable?: boolean;
};

function useDrag({ nodeRef, disabled = false, noDragClassName, handleSelector, nodeId, isSelectable }: UseDragParams) {
  const store = useStoreApi();
  const [dragging, setDragging] = useState<boolean>(false);
  const xyDrag = useRef<XYDragInstance>();

  useEffect(() => {
    if (nodeRef?.current) {
      xyDrag.current = XYDrag({
        domNode: nodeRef.current,
        getStoreItems: () => store.getState(),
        onNodeMouseDown: (id: string) => {
          handleNodeClick({
            id,
            store,
            nodeRef: nodeRef as RefObject<HTMLDivElement>,
          });
        },
        onDragStart: () => {
          setDragging(true);
        },
        onDragStop: () => {
          setDragging(false);
        },
      });
    }
  }, []);

  useEffect(() => {
    if (disabled) {
      xyDrag.current?.destroy();
    } else {
      xyDrag.current?.update({
        noDragClassName,
        handleSelector,
        domNode: nodeRef.current as Element,
        isSelectable,
        nodeId,
      });
      return () => {
        xyDrag.current?.destroy();
      };
    }
  }, [noDragClassName, handleSelector, disabled, isSelectable, nodeRef, nodeId]);

  return dragging;
}

export default useDrag;

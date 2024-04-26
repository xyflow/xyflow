import { XYDrag, type XYDragInstance } from '@xyflow/system';

import { handleNodeClick } from '../components/Nodes/utils';
import { useStoreApi } from './useStore';
import { createEffect, createSignal, onCleanup } from 'solid-js';
import { useRef } from '../utils/hooks';

type UseDragParams = {
  nodeRef?: () => HTMLDivElement | undefined;
  disabled?: () => boolean;
  noDragClassName?: () => string | undefined;
  handleSelector?: () => string | undefined;
  nodeId?: () => string | undefined;
  isSelectable?: () => boolean | undefined;
};

/**
 * Hook for calling XYDrag helper from @xyflow/system.
 *
 * @internal
 */
export function useDrag({
  nodeRef,
  disabled: getDisabled,
  // disabled = false,
  noDragClassName,
  handleSelector,
  nodeId,
  isSelectable,
}: UseDragParams) {
  const store = useStoreApi();
  const [dragging, setDragging] = createSignal<boolean>(false);
  const xyDrag = useRef<XYDragInstance | undefined>(undefined);
  const disabled = () => getDisabled?.() || false;

  createEffect(() => {
    xyDrag.current = XYDrag({
      getStoreItems: () => {
        return {
          nodes: store.nodes.get(),
          nodeLookup: store.nodeLookup,
          edges: store.edges.get(),
          nodeExtent: store.nodeExtent.get(),
          snapGrid: store.snapGrid.get(),
          snapToGrid: store.snapToGrid.get(),
          nodeOrigin: store.nodeOrigin.get(),
          multiSelectionActive: store.multiSelectionActive.get(),
          domNode: store.domNode.get(),
          transform: store.transform.get(),
          autoPanOnNodeDrag: store.autoPanOnNodeDrag.get(),
          nodesDraggable: store.nodesDraggable.get(),
          selectNodesOnDrag: store.selectNodesOnDrag.get(),
          nodeDragThreshold: store.nodeDragThreshold.get(),
          unselectNodesAndEdges: store.unselectNodesAndEdges,
          updateNodePositions: store.updateNodePositions,
          panBy: store.panBy,
        };
      },

      onNodeMouseDown: (id: string) => {
        handleNodeClick({
          id,
          store,
          nodeRef: nodeRef?.(),
        });
      },
      onDragStart: () => {
        console.log('drag start');
        setDragging(true);
      },
      onDragStop: () => {
        setDragging(false);
      },
    });
  });

  createEffect(() => {
    const domNode = nodeRef?.();
    if (disabled()) {
      xyDrag.current?.destroy();
    } else if (domNode) {
      xyDrag.current?.update({
        noDragClassName: noDragClassName?.(),
        handleSelector: handleSelector?.(),
        domNode,
        isSelectable: isSelectable?.(),
        nodeId: nodeId?.(),
      });
      onCleanup(() => {
        xyDrag.current?.destroy();
      });
    }
  });

  return dragging;
}

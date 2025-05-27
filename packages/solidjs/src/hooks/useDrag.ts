import { XYDrag, type XYDragInstance } from '@xyflow/system';

import { handleNodeClick } from '../components/Nodes/utils';
import { useStoreApi } from './useStore';
import { createEffect, createSignal, onCleanup } from 'solid-js';
import { useRef } from '../utils/hooks';

type UseDragParams = {
  nodeRef: () => HTMLDivElement | undefined;
  disabled?: () => boolean;
  noDragClassName?: () => string | undefined;
  handleSelector?: () => string | undefined;
  nodeId?: () => string | undefined;
  isSelectable?: () => boolean | undefined;
  nodeClickDistance?: () => number | undefined;
};

/**
 * Hook for calling XYDrag helper from @xyflow/system.
 *
 * @internal
 */
export function useDrag({
  nodeRef,
  disabled,
  noDragClassName,
  handleSelector,
  nodeId,
  isSelectable,
  nodeClickDistance,
}: UseDragParams) {
  const store = useStoreApi();
  const [dragging, setDragging] = createSignal<boolean>(false);
  const xyDrag = useRef<XYDragInstance | undefined>(undefined);

  createEffect(() => {
    // Create a getState function that accesses current reactive values
    const getState = () => ({
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
      panBy: store.panBy,
      unselectNodesAndEdges: store.unselectNodesAndEdges,
      updateNodePositions: store.updateNodePositions,
      onError: store.onError.get(),
      onNodeDragStart: store.onNodeDragStart,
      onNodeDrag: store.onNodeDrag,
      onNodeDragStop: store.onNodeDragStop,
      onSelectionDragStart: store.onSelectionDragStart,
      onSelectionDrag: store.onSelectionDrag,
      onSelectionDragStop: store.onSelectionDragStop,
      autoPanSpeed: store.autoPanSpeed.get(),
    });

    xyDrag.current = XYDrag({
      getStoreItems: getState,
      onNodeMouseDown: (id: string) => {
        handleNodeClick({
          id,
          store,
          nodeRef: nodeRef(),
        });
      },
      onDragStart: () => {
        setDragging(true);
      },
      onDragStop: () => {
        setDragging(false);
      },
    });
  });

  createEffect(() => {
    const domNode = nodeRef();
    const isDisabled = disabled?.() || false;

    if (isDisabled) {
      xyDrag.current?.destroy();
    } else if (domNode) {
      xyDrag.current?.update({
        noDragClassName: noDragClassName?.(),
        handleSelector: handleSelector?.(),
        domNode,
        isSelectable: isSelectable?.(),
        nodeId: nodeId?.(),
        nodeClickDistance: nodeClickDistance?.(),
      });
      onCleanup(() => {
        xyDrag.current?.destroy();
      });
    }
  });

  return dragging;
}

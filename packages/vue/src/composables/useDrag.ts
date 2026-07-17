import type { EdgeBase, NodeBase, NodeDragItem } from '@xyflow/system';
import type { MaybeRefOrGetter, Ref } from 'vue';
import type { NodeDragEvent } from '../types';
import { infiniteExtent, isCoordinateExtent, XYDrag } from '@xyflow/system';
import { shallowRef, toRef, toValue, watch, watchEffect } from 'vue';
import { handleNodeClick } from '../utils';
import { useStore } from './useStore';
import { useVueFlow } from './useVueFlow';

interface UseDragParams {
  onStart: (event: NodeDragEvent) => void;
  onDrag: (event: NodeDragEvent) => void;
  onStop: (event: NodeDragEvent) => void;
  onClick?: (event: PointerEvent) => void;
  el: Ref<HTMLDivElement | null>;
  disabled?: MaybeRefOrGetter<boolean>;
  selectable?: MaybeRefOrGetter<boolean>;
  dragHandle?: MaybeRefOrGetter<string | undefined>;
  id?: string;
}

/**
 * Composable that provides drag behavior for nodes
 *
 * @internal
 * @param params
 */
export function useDrag(params: UseDragParams) {
  const { panBy, getInternalNode, addSelectedNodes, removeSelectedNodes, removeSelectedEdges, updateNodePositions, getNodes, getEdges }
    = useVueFlow();

  const store = useStore();

  const { nodeLookup } = store;

  const nodesSelectionActive = toRef(store, 'nodesSelectionActive');

  const { onStart, onDrag, onStop, onClick, el, disabled, id, selectable, dragHandle } = params;

  const dragging = shallowRef(false);

  let dragInstance: ReturnType<typeof XYDrag> | undefined;

  watchEffect((onCleanup) => {
    const nodeEl = el.value;

    if (!nodeEl || toValue(disabled)) {
      return;
    }

    let dragFired = false;
    let pointerDownPos = { x: 0, y: 0 };

    dragInstance = XYDrag({
      getStoreItems: () => ({
        get nodes() {
          return getNodes.value as NodeBase[];
        },
        nodeLookup,
        get edges() {
          return getEdges.value as EdgeBase[];
        },
        nodeExtent: (isCoordinateExtent(store.nodeExtent)
          ? store.nodeExtent
          : infiniteExtent),
        snapGrid: store.snapGrid,
        snapToGrid: store.snapToGrid,
        nodeOrigin: store.nodeOrigin,
        multiSelectionActive: store.multiSelectionActive,
        domNode: store.vueFlowRef,
        transform: store.transform,
        autoPanOnNodeDrag: store.autoPanOnNodeDrag,
        nodesDraggable: store.nodesDraggable,
        selectNodesOnDrag: store.selectNodesOnDrag,
        nodeDragThreshold: store.nodeDragThreshold,
        panBy,
        unselectNodesAndEdges: (args) => {
          removeSelectedNodes(args?.nodes);
          removeSelectedEdges(args?.edges);
        },
        updateNodePositions: (dragItems, isDragging) => {
          const items: NodeDragItem[] = [];
          for (const item of dragItems.values()) {
            const node = getInternalNode(item.id);
            const width = item.measured?.width ?? node?.measured.width ?? 0;
            const height = item.measured?.height ?? node?.measured.height ?? 0;
            const positionAbsolute = item.internals?.positionAbsolute ?? node?.internals.positionAbsolute ?? { x: 0, y: 0 };
            items.push({
              id: item.id,
              position: item.position,
              // `distance` is a drag-item-only field; XYDrag always passes NodeDragItems, but the store-item
              // contract widens the value to InternalNodeBase, so narrow instead of assuming.
              distance: 'distance' in item ? item.distance : { x: 0, y: 0 },
              measured: { width, height },
              internals: { positionAbsolute },
              extent: item.extent,
              parentId: item.parentId,
              expandParent: item.expandParent,
              dragging: item.dragging,
              origin: item.origin,
            });
          }
          updateNodePositions(items, true, isDragging ?? false);
        },
        autoPanSpeed: store.autoPanSpeed,
      }),
      // select the node on drag-start when `selectNodesOnDrag` is on. Single-selection deselects the rest;
      // in multi-selection an already-selected node toggles off.
      onNodeMouseDown: (nodeId) => {
        const node = getInternalNode(nodeId);
        if (!node) {
          return;
        }

        handleNodeClick(
          node,
          store.multiSelectionActive,
          addSelectedNodes,
          removeSelectedNodes,
          nodesSelectionActive,
          false,
          nodeEl,
        );
      },
      onDragStart: (event, _dragItems, node, nodes) => {
        dragFired = true;
        dragging.value = true;
        onStart({ event, node, nodes });
      },
      onDrag: (event, _dragItems, node, nodes) => {
        onDrag({ event, node, nodes });
      },
      onDragStop: (event, _dragItems, node, nodes) => {
        dragging.value = false;
        onStop({ event, node, nodes });
      },
    });

    // Handle the "moved slightly but within threshold" click: XYDrag won't fire drag events for
    // sub-threshold movement and d3 suppresses the native click, so detect it with pointer listeners.
    const handlePointerDown = (e: PointerEvent) => {
      dragFired = false;
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!dragFired && onClick) {
        const dx = e.clientX - pointerDownPos.x;
        const dy = e.clientY - pointerDownPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0 && dist <= store.nodeDragThreshold) {
          onClick(e);
        }
      }
    };

    const target = nodeEl;
    target.addEventListener('pointerdown', handlePointerDown);
    target.addEventListener('pointerup', handlePointerUp);

    onCleanup(() => {
      dragInstance?.destroy();
      dragInstance = undefined;
      target.removeEventListener('pointerdown', handlePointerDown);
      target.removeEventListener('pointerup', handlePointerUp);
    });
  });

  // push prop changes to the live instance instead of tearing it down and rebuilding it
  watch(
    [
      () => store.noDragClassName,
      () => toValue(dragHandle),
      () => toValue(selectable),
      () => store.nodeClickDistance,
      () => toValue(disabled),
      el,
    ],
    ([noDragClassName, handleSelector, isSelectable, nodeClickDistance, isDisabled, nodeEl]) => {
      if (isDisabled || !nodeEl || !dragInstance) {
        return;
      }

      dragInstance.update({ noDragClassName, handleSelector, isSelectable, nodeId: id, domNode: nodeEl, nodeClickDistance });
    },
    { immediate: true },
  );

  return dragging;
}

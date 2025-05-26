import type { CoordinateExtent, EdgeBase, InternalNodeBase, NodeBase, NodeDragItem as SystemNodeDragItem } from '@xyflow/system';
import type { MaybeRefOrGetter, Ref } from 'vue';
import type { Node, NodeDragEvent, NodeDragItem } from '../types';
import { infiniteExtent, isCoordinateExtent, XYDrag } from '@xyflow/system';
import { shallowRef, toValue, watchEffect } from 'vue';
import { storeToRefs, useStore, useVueFlow } from '.';

interface UseDragParams {
  onStart: (event: NodeDragEvent) => void;
  onDrag: (event: NodeDragEvent) => void;
  onStop: (event: NodeDragEvent) => void;
  onClick?: (event: PointerEvent) => void;
  el: Ref<Element | null>;
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
  const { panBy, getInternalNode, removeSelectedNodes, removeSelectedEdges, updateNodePositions, getNodes, getEdges }
    = useVueFlow();

  const { nodeLookup } = useStore();

  const {
    vueFlowRef,
    snapToGrid,
    snapGrid,
    noDragClassName,
    nodeExtent,
    nodeOrigin,
    nodeDragThreshold,
    nodeClickDistance,
    transform,
    autoPanOnNodeDrag,
    autoPanSpeed,
    nodesDraggable,
    multiSelectionActive,
    selectNodesOnDrag,
  } = storeToRefs(useStore());

  const { onStart, onDrag, onStop, onClick, el, disabled, id, selectable, dragHandle } = params;

  const dragging = shallowRef(false);

  watchEffect((onCleanup) => {
    const nodeEl = el.value;

    if (!nodeEl || toValue(disabled)) {
      return;
    }

    let dragFired = false;
    let pointerDownPos = { x: 0, y: 0 };

    const dragInstance = XYDrag({
      getStoreItems: () => ({
        // lazy getters: XYDrag never destructures `nodes`/`edges` (verified against every getStoreItems
        // call site in system), and getStoreItems runs multiple times per pointermove — eagerly reading
        // the getters here would recompute them per frame (O(n+m) with `onlyRenderVisibleElements`).
        // getNodes is readonly (public guard); XYDrag reads node data from nodeLookup, not this array.
        get nodes() {
          return getNodes.value as NodeBase[];
        },
        nodeLookup,
        get edges() {
          return getEdges.value as EdgeBase[];
        },
        nodeExtent: (isCoordinateExtent(nodeExtent.value as CoordinateExtent)
          ? nodeExtent.value
          : infiniteExtent) as CoordinateExtent,
        snapGrid: snapGrid.value,
        snapToGrid: snapToGrid.value,
        nodeOrigin: nodeOrigin.value,
        multiSelectionActive: multiSelectionActive.value,
        domNode: vueFlowRef.value,
        transform: transform.value,
        autoPanOnNodeDrag: autoPanOnNodeDrag.value,
        nodesDraggable: nodesDraggable.value,
        selectNodesOnDrag: selectNodesOnDrag.value,
        nodeDragThreshold: nodeDragThreshold.value,
        panBy,
        unselectNodesAndEdges: (args?: { nodes?: any[]; edges?: any[] }) => {
          removeSelectedNodes(args?.nodes);
          removeSelectedEdges(args?.edges);
        },
        updateNodePositions: (dragItems: Map<string, SystemNodeDragItem | InternalNodeBase>, isDragging?: boolean) => {
          const items: NodeDragItem[] = [];
          for (const raw of dragItems.values()) {
            // XYDrag may emit either NodeDragItem (the normal case) or InternalNodeBase entries
            // (selection drags). Both shapes carry `measured` and `internals.positionAbsolute`.
            const item = raw as SystemNodeDragItem;
            const node = getInternalNode(item.id);
            const width = item.measured?.width ?? node?.measured.width ?? 0;
            const height = item.measured?.height ?? node?.measured.height ?? 0;
            const positionAbsolute = item.internals?.positionAbsolute ?? node?.internals.positionAbsolute ?? { x: 0, y: 0 };
            items.push({
              id: item.id,
              position: item.position,
              distance: item.distance ?? { x: 0, y: 0 },
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
        autoPanSpeed: autoPanSpeed.value,
      }),
      // XYDrag hands user nodes (the InternalNode's `userNode`, spread with the live drag position +
      // `dragging`), which is exactly the event payload — emit them directly, no lookup round-trip
      onDragStart: (event, _dragItems, node, nodes) => {
        dragFired = true;
        dragging.value = true;
        onStart({ event, node: node as Node, nodes: nodes as Node[] });
      },
      onDrag: (event, _dragItems, node, nodes) => {
        onDrag({ event, node: node as Node, nodes: nodes as Node[] });
      },
      onDragStop: (event, _dragItems, node, nodes) => {
        dragging.value = false;
        onStop({ event, node: node as Node, nodes: nodes as Node[] });
      },
    });

    dragInstance.update({
      noDragClassName: noDragClassName.value,
      handleSelector: toValue(dragHandle),
      isSelectable: toValue(selectable),
      nodeId: id,
      domNode: nodeEl,
      nodeClickDistance: nodeClickDistance.value,
    });

    // Handle the "moved slightly but within threshold" click case.
    // XYDrag won't fire drag events for sub-threshold movement, and d3 would normally
    // suppress the native click. We detect this case with pointer listeners.
    const handlePointerDown = (e: PointerEvent) => {
      dragFired = false;
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!dragFired && onClick) {
        const dx = e.clientX - pointerDownPos.x;
        const dy = e.clientY - pointerDownPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0 && dist <= nodeDragThreshold.value) {
          onClick(e);
        }
      }
    };

    const target = nodeEl as HTMLElement;
    target.addEventListener('pointerdown', handlePointerDown);
    target.addEventListener('pointerup', handlePointerUp);

    onCleanup(() => {
      dragInstance.destroy();
      target.removeEventListener('pointerdown', handlePointerDown);
      target.removeEventListener('pointerup', handlePointerUp);
    });
  });

  return dragging;
}

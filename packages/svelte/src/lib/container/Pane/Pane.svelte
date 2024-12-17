<script lang="ts" module>
  export function wrapHandler(
    handler: (evt: MouseEvent) => void,
    container: HTMLDivElement
  ): (evt: MouseEvent) => void {
    return (event: MouseEvent) => {
      if (event.target !== container) {
        return;
      }
      handler?.(event);
    };
  }

  export function toggleSelected<Item extends Node | Edge>(ids: string[]) {
    return (item: Item) => {
      const isSelected = ids.includes(item.id);

      if (item.selected !== isSelected) {
        return { ...item, selected: isSelected };
      }

      return item;
    };
  }
</script>

<script lang="ts">
  import {
    SelectionMode,
    getEventPosition,
    getNodesInside,
    getConnectedEdges
  } from '@xyflow/system';

  import type { Node, Edge, InternalNode } from '$lib/types';
  import type { PaneProps } from './types';

  let {
    store,
    panOnDrag = true,
    selectionOnDrag,
    onpaneclick,
    onpanecontextmenu,
    children
  }: PaneProps = $props();

  // svelte-ignore non_reactive_update
  let container: HTMLDivElement;
  let containerBounds: DOMRect | null = null;
  let selectedNodes: InternalNode[] = [];

  let panOnDragActive = $derived(store.panActivationKeyPressed || panOnDrag);
  let isSelecting = $derived(
    store.selectionKeyPressed ||
      store.selectionRect ||
      (selectionOnDrag && panOnDragActive !== true)
  );
  let hasActiveSelection = $derived(
    store.elementsSelectable && (isSelecting || store.selectionRectMode === 'user')
  );

  // Used to prevent click events when the user lets go of the selectionKey during a selection
  let selectionInProgress = false;

  function onClick(event: MouseEvent | TouchEvent) {
    // We prevent click events when the user let go of the selectionKey during a selection
    if (selectionInProgress) {
      selectionInProgress = false;
      return;
    }

    onpaneclick?.({ event });
    store.unselectNodesAndEdges();
    store.selectionRectMode = null;
  }

  function onPointerDown(event: PointerEvent) {
    containerBounds = container.getBoundingClientRect();

    if (
      !store.elementsSelectable ||
      !isSelecting ||
      event.button !== 0 ||
      event.target !== container ||
      !containerBounds
    ) {
      return;
    }

    (event.target as Element)?.setPointerCapture?.(event.pointerId);

    const { x, y } = getEventPosition(event, containerBounds);

    store.unselectNodesAndEdges();

    store.selectionRect = {
      width: 0,
      height: 0,
      startX: x,
      startY: y,
      x,
      y
    };

    // onSelectionStart?.(event);
  }

  function onPointerMove(event: PointerEvent) {
    if (!isSelecting || !containerBounds || !store.selectionRect) {
      return;
    }

    selectionInProgress = true;

    const mousePos = getEventPosition(event, containerBounds);
    const startX = store.selectionRect.startX ?? 0;
    const startY = store.selectionRect.startY ?? 0;
    const nextUserSelectRect = {
      ...store.selectionRect,
      x: mousePos.x < startX ? mousePos.x : startX,
      y: mousePos.y < startY ? mousePos.y : startY,
      width: Math.abs(mousePos.x - startX),
      height: Math.abs(mousePos.y - startY)
    };
    const prevSelectedNodeIds = selectedNodes.map((n) => n.id);
    const prevSelectedEdgeIds = getConnectedEdges(selectedNodes, store.edges).map((e) => e.id);

    selectedNodes = getNodesInside(
      store.nodeLookup,
      nextUserSelectRect,
      [store.viewport.x, store.viewport.y, store.viewport.zoom],
      store.selectionMode === SelectionMode.Partial,
      true
    );
    const selectedEdgeIds = getConnectedEdges(selectedNodes, store.edges).map((e) => e.id);
    const selectedNodeIds = selectedNodes.map((n) => n.id);

    // this prevents unnecessary updates while updating the selection rectangle
    if (
      prevSelectedNodeIds.length !== selectedNodeIds.length ||
      selectedNodeIds.some((id) => !prevSelectedNodeIds.includes(id))
    ) {
      store.nodes = store.nodes.map(toggleSelected(selectedNodeIds));
    }

    if (
      prevSelectedEdgeIds.length !== selectedEdgeIds.length ||
      selectedEdgeIds.some((id) => !prevSelectedEdgeIds.includes(id))
    ) {
      store.edges = store.edges.map(toggleSelected(selectedEdgeIds));
    }

    store.selectionRectMode = 'user';
    store.selectionRect = nextUserSelectRect;
  }

  function onPointerUp(event: PointerEvent) {
    if (event.button !== 0) {
      return;
    }

    (event.target as Element)?.releasePointerCapture?.(event.pointerId);

    // We only want to trigger click functions when in selection mode if
    // the user did not move the mouse.
    if (!isSelecting && store.selectionRectMode === 'user' && event.target === container) {
      onClick?.(event);
    }
    store.selectionRect = null;

    if (selectedNodes.length > 0) {
      store.selectionRectMode = 'nodes';
    }

    // If the user kept holding the selectionKey during the selection,
    // we need to reset the selectionInProgress, so the next click event is not prevented
    if (store.selectionKeyPressed) {
      selectionInProgress = false;
    }

    // onSelectionEnd?.(event);
  }

  const onContextMenu = (event: MouseEvent) => {
    if (Array.isArray(panOnDragActive) && panOnDragActive.includes(2)) {
      event.preventDefault();
      return;
    }

    onpanecontextmenu?.({ event });
  };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  bind:this={container}
  class="svelte-flow__pane"
  class:draggable={panOnDrag === true || (Array.isArray(panOnDrag) && panOnDrag.includes(0))}
  class:dragging={store.dragging}
  class:selection={isSelecting}
  onclick={hasActiveSelection ? undefined : wrapHandler(onClick, container)}
  onpointerdown={hasActiveSelection ? onPointerDown : undefined}
  onpointermove={hasActiveSelection ? onPointerMove : undefined}
  onpointerup={hasActiveSelection ? onPointerUp : undefined}
  oncontextmenu={wrapHandler(onContextMenu, container)}
>
  {@render children()}
</div>

<style>
  .svelte-flow__pane {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>

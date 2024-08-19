<script lang="ts" context="module">
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
        item.selected = isSelected;
      }

      return item;
    };
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    SelectionMode,
    getEventPosition,
    getNodesInside,
    getConnectedEdges
  } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import type { Node, Edge, InternalNode } from '$lib/types';
  import type { PaneProps } from './types';

  type $$Props = PaneProps;

  export let panOnDrag: $$Props['panOnDrag'] = undefined;
  export let selectionOnDrag: $$Props['selectionOnDrag'] = undefined;

  const dispatch = createEventDispatcher<{
    paneclick: {
      event: MouseEvent | TouchEvent;
    };
    panecontextmenu: {
      event: MouseEvent;
    };
  }>();
  const {
    nodes,
    nodeLookup,
    edges,
    viewport,
    dragging,
    elementsSelectable,
    selectionRect,
    selectionRectMode,
    selectionKeyPressed,
    selectionMode,
    panActivationKeyPressed,
    unselectNodesAndEdges
  } = useStore();

  let container: HTMLDivElement;
  let containerBounds: DOMRect | null = null;
  let selectedNodes: InternalNode[] = [];

  $: _panOnDrag = $panActivationKeyPressed || panOnDrag;
  $: isSelecting =
    $selectionKeyPressed || $selectionRect || (selectionOnDrag && _panOnDrag !== true);
  $: hasActiveSelection = $elementsSelectable && (isSelecting || $selectionRectMode === 'user');

  // Used to prevent click events when the user lets go of the selectionKey during a selection
  let selectionInProgress = false;

  function onClick(event: MouseEvent | TouchEvent) {
    // We prevent click events when the user let go of the selectionKey during a selection
    if (selectionInProgress) {
      selectionInProgress = false;
      return;
    }

    dispatch('paneclick', { event });
    unselectNodesAndEdges();
    selectionRectMode.set(null);
  }

  function onPointerDown(event: PointerEvent) {
    containerBounds = container.getBoundingClientRect();

    if (
      !elementsSelectable ||
      !isSelecting ||
      event.button !== 0 ||
      event.target !== container ||
      !containerBounds
    ) {
      return;
    }

    (event.target as Element)?.setPointerCapture?.(event.pointerId);

    const { x, y } = getEventPosition(event, containerBounds);

    unselectNodesAndEdges();

    selectionRect.set({
      width: 0,
      height: 0,
      startX: x,
      startY: y,
      x,
      y
    });

    // onSelectionStart?.(event);
  }

  function onPointerMove(event: PointerEvent) {
    if (!isSelecting || !containerBounds || !$selectionRect) {
      return;
    }

    selectionInProgress = true;

    const mousePos = getEventPosition(event, containerBounds);
    const startX = $selectionRect.startX ?? 0;
    const startY = $selectionRect.startY ?? 0;
    const nextUserSelectRect = {
      ...$selectionRect,
      x: mousePos.x < startX ? mousePos.x : startX,
      y: mousePos.y < startY ? mousePos.y : startY,
      width: Math.abs(mousePos.x - startX),
      height: Math.abs(mousePos.y - startY)
    };
    const prevSelectedNodeIds = selectedNodes.map((n) => n.id);
    const prevSelectedEdgeIds = getConnectedEdges(selectedNodes, $edges).map((e) => e.id);

    selectedNodes = getNodesInside(
      $nodeLookup,
      nextUserSelectRect,
      [$viewport.x, $viewport.y, $viewport.zoom],
      $selectionMode === SelectionMode.Partial,
      true
    );
    const selectedEdgeIds = getConnectedEdges(selectedNodes, $edges).map((e) => e.id);
    const selectedNodeIds = selectedNodes.map((n) => n.id);

    // this prevents unnecessary updates while updating the selection rectangle
    if (
      prevSelectedNodeIds.length !== selectedNodeIds.length ||
      selectedNodeIds.some((id) => !prevSelectedNodeIds.includes(id))
    ) {
      nodes.update((nodes) => nodes.map(toggleSelected(selectedNodeIds)));
    }

    if (
      prevSelectedEdgeIds.length !== selectedEdgeIds.length ||
      selectedEdgeIds.some((id) => !prevSelectedEdgeIds.includes(id))
    ) {
      edges.update((edges) => edges.map(toggleSelected(selectedEdgeIds)));
    }

    selectionRectMode.set('user');
    selectionRect.set(nextUserSelectRect);
  }

  function onPointerUp(event: PointerEvent) {
    if (event.button !== 0) {
      return;
    }

    (event.target as Element)?.releasePointerCapture?.(event.pointerId);

    // We only want to trigger click functions when in selection mode if
    // the user did not move the mouse.
    if (!isSelecting && $selectionRectMode === 'user' && event.target === container) {
      onClick?.(event);
    }
    selectionRect.set(null);

    if (selectedNodes.length > 0) {
      $selectionRectMode = 'nodes';
    }

    // If the user kept holding the selectionKey during the selection,
    // we need to reset the selectionInProgress, so the next click event is not prevented
    if ($selectionKeyPressed) {
      selectionInProgress = false;
    }

    // onSelectionEnd?.(event);
  }

  const onContextMenu = (event: MouseEvent) => {
    if (Array.isArray(_panOnDrag) && _panOnDrag?.includes(2)) {
      event.preventDefault();
      return;
    }

    dispatch('panecontextmenu', { event });
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={container}
  class="svelte-flow__pane"
  class:draggable={panOnDrag === true || (Array.isArray(panOnDrag) && panOnDrag.includes(0))}
  class:dragging={$dragging}
  class:selection={isSelecting}
  on:click={hasActiveSelection ? undefined : wrapHandler(onClick, container)}
  on:pointerdown={hasActiveSelection ? onPointerDown : undefined}
  on:pointermove={hasActiveSelection ? onPointerMove : undefined}
  on:pointerup={hasActiveSelection ? onPointerUp : undefined}
  on:contextmenu={wrapHandler(onContextMenu, container)}
>
  <slot />
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

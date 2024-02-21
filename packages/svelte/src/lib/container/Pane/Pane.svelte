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
        return {
          ...item,
          selected: isSelected
        };
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
  import type { Node, Edge } from '$lib/types';
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
  let selectedNodes: Node[] = [];

  $: _panOnDrag = $panActivationKeyPressed || panOnDrag;
  $: isSelecting =
    $selectionKeyPressed || $selectionRect || (selectionOnDrag && _panOnDrag !== true);
  $: hasActiveSelection = $elementsSelectable && (isSelecting || $selectionRectMode === 'user');

  function onClick(event: MouseEvent | TouchEvent) {
    dispatch('paneclick', { event });

    unselectNodesAndEdges();
    selectionRectMode.set(null);
  }

  function onMouseDown(event: MouseEvent) {
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

  function onMouseMove(event: MouseEvent) {
    if (!isSelecting || !containerBounds || !$selectionRect) {
      return;
    }
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

    selectedNodes = getNodesInside<Node>(
      $nodes,
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

  function onMouseUp(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    // We only want to trigger click functions when in selection mode if
    // the user did not move the mouse.
    if (!isSelecting && $selectionRectMode === 'user' && event.target === container) {
      onClick?.(event);
    }
    selectionRect.set(null);

    if (selectedNodes.length > 0) {
      selectionRectMode.set('nodes');
    }

    // onSelectionEnd?.(event);
  }

  const onMouseLeave = (event: MouseEvent) => {
    if ($selectionRectMode === 'user') {
      selectionRectMode.set(selectedNodes.length > 0 ? 'nodes' : null);
      //  onSelectionEnd?.(event);
    }

    selectionRect.set(null);
  };

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
  class:draggable={panOnDrag}
  class:dragging={$dragging}
  class:selection={isSelecting}
  on:click={hasActiveSelection ? undefined : wrapHandler(onClick, container)}
  on:mousedown={hasActiveSelection ? onMouseDown : undefined}
  on:mousemove={hasActiveSelection ? onMouseMove : undefined}
  on:mouseup={hasActiveSelection ? onMouseUp : undefined}
  on:mouseleave={hasActiveSelection ? onMouseLeave : undefined}
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

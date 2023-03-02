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
  import { SelectionMode } from '@reactflow/system';
  import { getEventPosition, getNodesInside } from '@reactflow/utils';
  
  import { useStore } from '$lib/store';
  import { getConnectedEdges } from '$lib/utils';
  import type { Node, Edge } from '$lib/types';

  const dispatch = createEventDispatcher();
  const {
    nodes,
    edges,
    transform,
    nodeOrigin,
    dragging,
    selectionRect,
    selectionRectMode,
    selectionKeyPressed,
    resetSelectedElements
  } = useStore();

  // @todo take from props
  const elementsSelectable = true;
  const selectionMode = SelectionMode.Partial;

  let container: HTMLDivElement;
  let containerBounds: DOMRect | null = null;
  let selectedNodes: Node[] = [];

  $: isSelecting = $selectionKeyPressed;
  $: hasActiveSelection = elementsSelectable && (isSelecting || $selectionRectMode === 'user');

  function onClick(event: MouseEvent) {
    dispatch('pane:click', event);

    resetSelectedElements();
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

    resetSelectedElements();

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

    selectedNodes = getNodesInside<Node>(
      $nodes,
      nextUserSelectRect,
      $transform,
      selectionMode === SelectionMode.Partial,
      true,
      $nodeOrigin
    );
    const selectedEdgeIds = getConnectedEdges(selectedNodes, $edges).map((e) => e.id);
    const selectedNodeIds = selectedNodes.map((n) => n.id);

    nodes.update((nodes) => nodes.map(toggleSelected(selectedNodeIds)));
    edges.update((edges) => edges.map(toggleSelected(selectedEdgeIds)));

    selectionRectMode.set('user');
    selectionRect.set(nextUserSelectRect);
  }

  function onMouseUp(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    // We only want to trigger click functions when in selection mode if
    // the user did not move the mouse.
    // if (!userSelectionActive && userSelectionRect && event.target === container.current) {
    //   onClick?.(event);
    // }
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
    // if (Array.isArray(panOnDrag) && panOnDrag?.includes(2)) {
    //   event.preventDefault();
    //   return;
    // }

    dispatch('pane:contextmenu', event);
  };

</script>

<div
  bind:this={container}
  class="svelte-flow__pane"
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
    cursor: grab;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .selection {
    cursor: pointer;
  }

  .dragging {
    cursor: grabbing;
  }
</style>

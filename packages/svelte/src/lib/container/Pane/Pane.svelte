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
  import {
    SelectionMode,
    getEventPosition,
    getNodesInside,
    getConnectedEdges
  } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import type { Node, Edge } from '$lib/types';
  import type { PaneProps } from './types';

  let { panOnDrag, selectionOnDrag, onpaneclick, onpanecontextmenu, children }: PaneProps =
    $props();

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

  let container: HTMLDivElement | null = $state(null);
  let containerBounds: DOMRect | null = $state(null);
  let selectedNodes: Node[] = $state([]);

  let panOnDragActive = $derived($panActivationKeyPressed || panOnDrag);
  let isSelecting = $derived(
    $selectionKeyPressed || $selectionRect || (selectionOnDrag && panOnDragActive !== true)
  );
  let hasActiveSelection = $derived(
    $elementsSelectable && (isSelecting || $selectionRectMode === 'user')
  );

  function onClick(event: MouseEvent | TouchEvent) {
    onpaneclick?.({ event });

    unselectNodesAndEdges();
    selectionRectMode.set(null);
  }

  function onMouseDown(event: MouseEvent) {
    containerBounds = container!.getBoundingClientRect();

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
      $selectionRectMode = 'nodes';
    }

    // onSelectionEnd?.(event);
  }

  const onMouseLeave = () => {
    if ($selectionRectMode === 'user') {
      selectionRectMode.set(selectedNodes.length > 0 ? 'nodes' : null);
      //  onSelectionEnd?.(event);
    }

    selectionRect.set(null);
  };

  const onContextMenu = (event: MouseEvent) => {
    // panOnDrag might be an array of numbers that define the mouse buttons
    // that should trigger panning on drag
    if (Array.isArray(panOnDragActive) && panOnDragActive?.includes(2)) {
      event.preventDefault();
      return;
    }

    onpanecontextmenu?.({ event });
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
  onclick={hasActiveSelection ? undefined : wrapHandler(onClick, container!)}
  onmousedown={hasActiveSelection ? onMouseDown : undefined}
  onmousemove={hasActiveSelection ? onMouseMove : undefined}
  onmouseup={hasActiveSelection ? onMouseUp : undefined}
  onmouseleave={hasActiveSelection ? onMouseLeave : undefined}
  oncontextmenu={wrapHandler(onContextMenu, container!)}
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

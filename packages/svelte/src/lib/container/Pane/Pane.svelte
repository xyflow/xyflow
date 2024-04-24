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

  const store = useStore();
  const { nodes, edges, viewport } = store;

  let container: HTMLDivElement | null = $state(null);
  let containerBounds: DOMRect | null = $state(null);
  let selectedNodes: Node[] = $state([]);

  let panOnDragActive = $derived(store.panActivationKeyPressed || panOnDrag);
  let isSelecting = $derived(
    store.selectionKeyPressed ||
      store.selectionRect ||
      (selectionOnDrag && panOnDragActive !== true)
  );
  let hasActiveSelection = $derived(
    store.elementsSelectable && (isSelecting || store.selectionRectMode === 'user')
  );

  function onClick(event: MouseEvent | TouchEvent) {
    onpaneclick?.({ event });

    store.unselectNodesAndEdges();
    store.selectionRectMode = null;
  }

  function onMouseDown(event: MouseEvent) {
    containerBounds = container!.getBoundingClientRect();

    if (
      !store.elementsSelectable ||
      !isSelecting ||
      event.button !== 0 ||
      event.target !== container ||
      !containerBounds
    ) {
      return;
    }

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

  function onMouseMove(event: MouseEvent) {
    if (!isSelecting || !containerBounds || !store.selectionRect) {
      return;
    }
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
    const prevSelectedEdgeIds = getConnectedEdges(selectedNodes, $edges).map((e) => e.id);

    selectedNodes = getNodesInside(
      store.nodeLookup,
      nextUserSelectRect,
      [$viewport.x, $viewport.y, $viewport.zoom],
      store.selectionMode === SelectionMode.Partial,
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

    store.selectionRectMode = 'user';
    store.selectionRect = nextUserSelectRect;
  }

  function onMouseUp(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    // We only want to trigger click functions when in selection mode if
    // the user did not move the mouse.
    if (!isSelecting && store.selectionRectMode === 'user' && event.target === container) {
      onClick?.(event);
    }
    store.selectionRect = null;

    if (selectedNodes.length > 0) {
      store.selectionRectMode = 'nodes';
    }

    // onSelectionEnd?.(event);
  }

  const onMouseLeave = () => {
    if (store.selectionRectMode === 'user') {
      store.selectionRectMode = selectedNodes.length > 0 ? 'nodes' : null;
      //  onSelectionEnd?.(event);
    }

    store.selectionRect = null;
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
  class:dragging={store.dragging}
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

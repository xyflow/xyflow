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

  export function toggleSelected<Item extends Node | Edge>(ids: Set<string>) {
    return (item: Item) => {
      const isSelected = ids.has(item.id);

      if (!!item.selected !== isSelected) {
        return { ...item, selected: isSelected };
      }

      return item;
    };
  }

  function isSetEqual(a: Set<string>, b: Set<string>) {
    if (a.size !== b.size) {
      return false;
    }

    for (const item of a) {
      if (!b.has(item)) {
        return false;
      }
    }

    return true;
  }
</script>

<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import { SelectionMode, getEventPosition, getNodesInside } from '@xyflow/system';

  import type { Node, Edge } from '$lib/types';
  import type { PaneProps } from './types';

  let {
    store = $bindable(),
    panOnDrag = true,
    paneClickDistance = 1,
    selectionOnDrag,
    onpaneclick,
    onpanecontextmenu,
    onselectionstart,
    onselectionend,
    children
  }: PaneProps<NodeType, EdgeType> = $props();

  // svelte-ignore non_reactive_update
  let container: HTMLDivElement;
  let containerBounds: DOMRect | null = null;

  /* eslint-disable svelte/prefer-svelte-reactivity */
  let selectedNodeIds: Set<string> = new Set();
  let selectedEdgeIds: Set<string> = new Set();
  /* eslint-enable svelte/prefer-svelte-reactivity */

  let panOnDragActive = $derived(store.panActivationKeyPressed || panOnDrag);
  let isSelecting = $derived(
    store.selectionKeyPressed ||
      !!store.selectionRect ||
      (selectionOnDrag && panOnDragActive !== true)
  );
  let isSelectionEnabled = $derived(
    store.elementsSelectable && (isSelecting || store.selectionRectMode === 'user')
  );

  // Used to prevent click events when the user lets go of the selectionKey during a selection
  let selectionInProgress = false;

  // We start the selection process when the user clicks down on the pane
  function onPointerDownCapture(event: PointerEvent) {
    containerBounds = container?.getBoundingClientRect();
    if (!containerBounds) return;

    const eventTargetIsContainer = event.target === container;

    const isNoKeyEvent =
      !eventTargetIsContainer && !!(event.target as HTMLElement).closest('.nokey');

    const isSelectionActive =
      (selectionOnDrag && eventTargetIsContainer) || store.selectionKeyPressed;

    if (
      isNoKeyEvent ||
      !isSelecting ||
      !isSelectionActive ||
      event.button !== 0 ||
      !event.isPrimary
    ) {
      return;
    }

    (event.target as Partial<Element>)?.setPointerCapture?.(event.pointerId);

    selectionInProgress = false;

    const { x, y } = getEventPosition(event, containerBounds);

    store.selectionRect = {
      width: 0,
      height: 0,
      startX: x,
      startY: y,
      x,
      y
    };

    if (!eventTargetIsContainer) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function onPointerMove(event: PointerEvent) {
    if (!isSelecting || !containerBounds || !store.selectionRect) {
      return;
    }

    const mousePos = getEventPosition(event, containerBounds);
    const { startX = 0, startY = 0 } = store.selectionRect;

    if (!selectionInProgress) {
      const requiredDistance = store.selectionKeyPressed ? 0 : paneClickDistance;
      const distance = Math.hypot(mousePos.x - startX, mousePos.y - startY);
      if (distance <= requiredDistance) {
        return;
      }
      store.unselectNodesAndEdges();
      onselectionstart?.(event);
    }

    selectionInProgress = true;

    const nextUserSelectRect = {
      ...store.selectionRect,
      x: mousePos.x < startX ? mousePos.x : startX,
      y: mousePos.y < startY ? mousePos.y : startY,
      width: Math.abs(mousePos.x - startX),
      height: Math.abs(mousePos.y - startY)
    };

    const prevSelectedNodeIds = selectedNodeIds;
    const prevSelectedEdgeIds = selectedEdgeIds;

    selectedNodeIds = new Set(
      getNodesInside(
        store.nodeLookup,
        nextUserSelectRect,
        [store.viewport.x, store.viewport.y, store.viewport.zoom],
        store.selectionMode === SelectionMode.Partial,
        true
      ).map((n) => n.id)
    );

    const edgesSelectable = store.defaultEdgeOptions.selectable ?? true;
    selectedEdgeIds = new Set();

    // We look for all edges connected to the selected nodes
    for (const nodeId of selectedNodeIds) {
      const connections = store.connectionLookup.get(nodeId);
      if (!connections) continue;
      for (const { edgeId } of connections.values()) {
        const edge = store.edgeLookup.get(edgeId);
        if (edge && (edge.selectable ?? edgesSelectable)) {
          selectedEdgeIds.add(edgeId);
        }
      }
    }

    // this prevents unnecessary updates while updating the selection rectangle
    if (!isSetEqual(prevSelectedNodeIds, selectedNodeIds)) {
      store.nodes = store.nodes.map(toggleSelected(selectedNodeIds));
    }

    if (!isSetEqual(prevSelectedEdgeIds, selectedEdgeIds)) {
      store.edges = store.edges.map(toggleSelected(selectedEdgeIds));
    }

    store.selectionRectMode = 'user';
    store.selectionRect = nextUserSelectRect;
  }

  function onPointerUp(event: PointerEvent) {
    if (event.button !== 0) {
      return;
    }

    (event.target as Partial<Element>)?.releasePointerCapture?.(event.pointerId);

    // We only want to trigger click functions when in selection mode if
    // the user did not move the mouse.

    if (!selectionInProgress && event.target === container) {
      onClick?.(event);
    }

    store.selectionRect = null;

    if (selectionInProgress) {
      store.selectionRectMode = selectedNodeIds.size > 0 ? 'nodes' : null;
    }

    if (selectionInProgress) {
      onselectionend?.(event);
    }
  }

  const onContextMenu = (event: MouseEvent) => {
    if (Array.isArray(panOnDragActive) && panOnDragActive.includes(2)) {
      event.preventDefault();
      return;
    }

    onpanecontextmenu?.({ event });
  };

  const onClickCapture = (event: MouseEvent) => {
    if (selectionInProgress) {
      event.stopPropagation();
      selectionInProgress = false;
    }
  };

  function onClick(event: MouseEvent) {
    // We prevent click events when the user let go of the selectionKey during a selection
    // We also prevent click events when a connection is in progress
    if (selectionInProgress || store.connection.inProgress) {
      selectionInProgress = false;
      return;
    }

    onpaneclick?.({ event });
    store.unselectNodesAndEdges();
    store.selectionRectMode = null;
    store.selectionRect = null;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  bind:this={container}
  class="svelte-flow__pane svelte-flow__container"
  class:draggable={panOnDrag === true || (Array.isArray(panOnDrag) && panOnDrag.includes(0))}
  class:dragging={store.dragging}
  class:selection={isSelecting}
  onclick={isSelectionEnabled ? undefined : wrapHandler(onClick, container)}
  onpointerdowncapture={isSelectionEnabled ? onPointerDownCapture : undefined}
  onpointermove={isSelectionEnabled ? onPointerMove : undefined}
  onpointerup={isSelectionEnabled ? onPointerUp : undefined}
  oncontextmenu={wrapHandler(onContextMenu, container)}
  onclickcapture={isSelectionEnabled ? onClickCapture : undefined}
>
  {@render children()}
</div>

<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import { type PanZoomInstance, type Transform } from '@xyflow/system';

  import zoom from '$lib/actions/zoom';
  import type { ZoomProps } from './types';
  import type { Node, Edge } from '$lib/types';

  let {
    store = $bindable(),
    panOnScrollMode,
    preventScrolling,
    zoomOnScroll,
    zoomOnDoubleClick,
    zoomOnPinch,
    panOnDrag,
    panOnScroll,
    panOnScrollSpeed,
    paneClickDistance,
    selectionOnDrag,
    onmovestart,
    onmove,
    onmoveend,
    oninit,
    children
  }: ZoomProps<NodeType, EdgeType> = $props();

  let panOnDragActive = $derived(store.panActivationKeyPressed || panOnDrag);
  let panOnScrollActive = $derived(store.panActivationKeyPressed || panOnScroll);

  // We extract the initial value by destructuring
  const { viewport: initialViewport } = store;

  let onInitCalled = false;
  $effect(() => {
    if (!onInitCalled && store.viewportInitialized) {
      oninit?.();
      onInitCalled = true;
    }
  });
</script>

<div
  class="svelte-flow__zoom svelte-flow__container"
  use:zoom={{
    viewport: store.viewport,
    minZoom: store.minZoom,
    maxZoom: store.maxZoom,
    initialViewport,
    onDraggingChange: (dragging: boolean) => {
      store.dragging = dragging;
    },
    setPanZoomInstance: (instance: PanZoomInstance) => {
      store.panZoom = instance;
    },
    onPanZoomStart: onmovestart,
    onPanZoom: onmove,
    onPanZoomEnd: onmoveend,
    zoomOnScroll,
    zoomOnDoubleClick,
    zoomOnPinch,
    panOnScroll: panOnScrollActive,
    panOnDrag: panOnDragActive,
    panOnScrollSpeed,
    panOnScrollMode,
    zoomActivationKeyPressed: store.zoomActivationKeyPressed,
    preventScrolling: typeof preventScrolling === 'boolean' ? preventScrolling : true,
    noPanClassName: store.noPanClass,
    noWheelClassName: store.noWheelClass,
    userSelectionActive: !!store.selectionRect,
    translateExtent: store.translateExtent,
    lib: 'svelte',
    paneClickDistance,
    selectionOnDrag,
    onTransformChange: (transform: Transform) => {
      store.viewport = { x: transform[0], y: transform[1], zoom: transform[2] };
    },
    connectionInProgress: store.connection.inProgress
  }}
>
  {@render children()}
</div>

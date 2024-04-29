<script lang="ts">
  import { onMount } from 'svelte';
  import { PanOnScrollMode } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import zoom from '$lib/actions/zoom';

  import type { ZoomProps } from './types';

  let {
    initialViewport = { x: 0, y: 0, zoom: 1 },
    onMoveStart,
    onMove,
    onMoveEnd,
    panOnScrollMode,
    preventScrolling,
    zoomOnScroll,
    zoomOnDoubleClick,
    zoomOnPinch,
    panOnDrag,
    panOnScroll,
    children
  }: ZoomProps = $props();

  const store = useStore();

  let panOnDragActive = $derived(store.panActivationKeyPressed || panOnDrag);
  let panOnScrollActive = $derived(store.panActivationKeyPressed || panOnScroll);

  onMount(() => {
    store.viewportInitialized = true;
  });
</script>

<div
  class="svelte-flow__zoom"
  use:zoom={{
    store,
    minZoom: store.minZoom,
    maxZoom: store.maxZoom,
    initialViewport,
    onPanZoomStart: onMoveStart,
    onPanZoom: onMove,
    onPanZoomEnd: onMoveEnd,
    zoomOnScroll,
    zoomOnDoubleClick,
    zoomOnPinch,
    panOnScroll: panOnScrollActive,
    panOnDrag: panOnDragActive,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: panOnScrollMode || PanOnScrollMode.Free,
    zoomActivationKeyPressed: store.zoomActivationKeyPressed,
    preventScrolling: typeof preventScrolling === 'boolean' ? preventScrolling : true,
    noPanClassName: 'nopan',
    noWheelClassName: 'nowheel',
    userSelectionActive: store.selectionKeyPressed,
    translateExtent: store.translateExtent,
    lib: 'svelte'
  }}
>
  {@render children()}
</div>

<style>
  .svelte-flow__zoom {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
  }
</style>

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

  const {
    viewport,
    panZoom,
    selectionKeyPressed,
    minZoom,
    maxZoom,
    dragging,
    translateExtent,
    lib,
    panActivationKeyPressed,
    zoomActivationKeyPressed,
    viewportInitialized
  } = useStore();

  let panOnDragActive = $derived($panActivationKeyPressed || panOnDrag);
  let panOnScrollActive = $derived($panActivationKeyPressed || panOnScroll);

  onMount(() => {
    $viewportInitialized = true;
  });
</script>

<div
  class="svelte-flow__zoom"
  use:zoom={{
    viewport,
    minZoom: $minZoom,
    maxZoom: $maxZoom,
    initialViewport,
    dragging,
    panZoom,
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
    zoomActivationKeyPressed: $zoomActivationKeyPressed,
    preventScrolling: typeof preventScrolling === 'boolean' ? preventScrolling : true,
    noPanClassName: 'nopan',
    noWheelClassName: 'nowheel',
    userSelectionActive: $selectionKeyPressed,
    translateExtent: $translateExtent,
    lib: $lib
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

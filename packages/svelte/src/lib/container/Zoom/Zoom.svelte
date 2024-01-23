<script lang="ts">
  import { PanOnScrollMode } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import zoom from '$lib/actions/zoom';
  import type { ZoomProps } from './types';
  import { onMount } from 'svelte';

  type $$Props = ZoomProps;

  export let initialViewport: $$Props['initialViewport'];
  export let onMoveStart: $$Props['onMoveStart'] = undefined;
  export let onMove: $$Props['onMove'] = undefined;
  export let onMoveEnd: $$Props['onMoveEnd'] = undefined;
  export let panOnScrollMode: $$Props['panOnScrollMode'];
  export let preventScrolling: $$Props['preventScrolling'];
  export let zoomOnScroll: $$Props['zoomOnScroll'];
  export let zoomOnDoubleClick: $$Props['zoomOnDoubleClick'];
  export let zoomOnPinch: $$Props['zoomOnPinch'];
  export let panOnDrag: $$Props['panOnDrag'];
  export let panOnScroll: $$Props['panOnScroll'];

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

  $: viewPort = initialViewport || { x: 0, y: 0, zoom: 1 };
  $: _panOnDrag = $panActivationKeyPressed || panOnDrag;
  $: _panOnScroll = $panActivationKeyPressed || panOnScroll;

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
    initialViewport: viewPort,
    dragging,
    panZoom,
    onPanZoomStart: onMoveStart,
    onPanZoom: onMove,
    onPanZoomEnd: onMoveEnd,
    zoomOnScroll,
    zoomOnDoubleClick,
    zoomOnPinch,
    panOnScroll: _panOnScroll,
    panOnDrag: _panOnDrag,
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
  <slot />
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

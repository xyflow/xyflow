<script lang="ts"> 
  import { useStore } from '$lib/store';
  import zoom from '$lib/actions/zoom';
  import type { ZoomProps } from './types';

  type $$Props = ZoomProps; 

  export let initialViewport: $$Props['initialViewport'] = undefined;
  export let onMoveStart: $$Props['onMoveStart'] = undefined;
  export let onMove: $$Props['onMove'] = undefined;
  export let onMoveEnd: $$Props['onMoveEnd'] = undefined;

  const { transform, d3, selectionKeyPressed, selectionRectMode, minZoom, maxZoom, dragging } = useStore();
  
  $: viewPort = initialViewport || { x: 0, y: 0, zoom: 1 };
  $: selecting = $selectionKeyPressed || $selectionRectMode === 'user';
</script>

<div class="svelte-flow__zoom" use:zoom={{
  transform,
  d3,
  selecting,
  minZoom: $minZoom,
  maxZoom: $maxZoom,
  initialViewport: viewPort,
  dragging,
  onMoveStart,
  onMove,
  onMoveEnd
}}>
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

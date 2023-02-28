<script lang="ts">
  import { useStore } from '$lib/store';
  import zoom from '$lib/actions/zoom';

  const { transform, d3, selectionKeyPressed, selectionRectMode } = useStore();

  $: selecting = $selectionKeyPressed || $selectionRectMode === 'user';
</script>

<div class="react-flow__zoom" use:zoom={{ transform, d3, selecting }}>
  <slot />
</div>

<style>
  .react-flow__zoom {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
  }
</style>
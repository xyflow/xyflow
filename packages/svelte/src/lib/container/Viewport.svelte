<script lang="ts">
	import { useStore } from '$lib/store';

  const { transform } = useStore();
</script>

<div
  class="react-flow__viewport" 
  style="transform: translate({$transform[0]}px, {$transform[1]}px) scale({$transform[2]})"
>
  <slot />
</div>

<style>
  .react-flow__viewport {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-origin: 0 0;
    top: 0;
    left: 0;
    z-index: 2;
    pointer-events: none;
  }
</style>
<script lang="ts">
	import { useStore } from '$lib/store';

  const { transformStore} = useStore();
</script>

<div
  class="react-flow__viewport" 
  style="transform: translate({$transformStore[0]}px, {$transformStore[1]}px) scale({$transformStore[2]})"
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
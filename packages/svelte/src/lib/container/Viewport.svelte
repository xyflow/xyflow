<script lang="ts">
  import zoom  from '$lib/hooks/zoom'
	import { useStore } from '$lib/store';

  const { transformStore } = useStore();
</script>

<div class="react-flow__pane" use:zoom={{ transformStore }}>
  <div
    class="react-flow__viewport" 
    style="transform: translate({$transformStore[0]}px, {$transformStore[1]}px) scale({$transformStore[2]})"
  >
    <slot></slot>
  </div>
</div>

<style>
  .react-flow__pane {
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left:0;
    cursor: grab;
  }

  .react-flow__viewport {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-origin: 0 0;
    top:0;
    left:0;
  }
</style>
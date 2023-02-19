<script lang="ts">
	import type { PanelPosition } from '@reactflow/system';
  import cc from 'classcat';

  export let position: PanelPosition = 'top-right';
  export { className as class }

  let className: string;

  $: positionClasses = `${position}`.split('-');
</script>

<div
  class={cc(['react-flow__panel', className, ...positionClasses])}
>
  <slot />
</div>

<style>
  .react-flow__panel {
    position: absolute;
    z-index: 5;
    margin: 15px;
  }

  .react-flow__panel.top {
    top: 0;
  }

  .react-flow__panel.bottom {
    bottom: 0;
  }

  .react-flow__panel.left {
    left: 0;
  }

  .react-flow__panel.right {
    right: 0;
  }

  .react-flow__panel.center {
    left: 50%;
    transform: translateX(-50%);
  }
</style>
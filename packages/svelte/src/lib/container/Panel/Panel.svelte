<script lang="ts">
  import cc from 'classcat';
  import type { PanelProps } from './types';

  interface $$Props extends PanelProps {}

  export let position: $$Props['position'] = 'top-right';
  export let style: $$Props['style'] = '';
  let className: $$Props['class'] = undefined;
  export { className as class };

  $: positionClasses = `${position}`.split('-');
</script>

<div class={cc(['svelte-flow__panel', className, ...positionClasses])} {style}>
  <slot />
</div>

<style>
  .svelte-flow__panel {
    position: absolute;
    z-index: 5;
    margin: 15px;
  }

  .svelte-flow__panel.top {
    top: 0;
  }

  .svelte-flow__panel.bottom {
    bottom: 0;
  }

  .svelte-flow__panel.left {
    left: 0;
  }

  .svelte-flow__panel.right {
    right: 0;
  }

  .svelte-flow__panel.center {
    left: 50%;
    transform: translateX(-50%);
  }
</style>

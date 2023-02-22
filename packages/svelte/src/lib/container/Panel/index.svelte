<script lang="ts">
  import cc from 'classcat';
  import type { PanelProps } from './Panel';

  interface $$Props extends PanelProps {}

  export let position: $$Props['position'] = 'top-right';
  export let style: $$Props['style'] = '';
  let className: $$Props['class'] = undefined;
  export { className as class }

  $: positionClasses = `${position}`.split('-');
</script>

<div
  class={cc(['react-flow__panel', className, ...positionClasses])}
  style={style}
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
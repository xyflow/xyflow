<script lang="ts">
  import cc from 'classcat';
  import type { PanelProps } from './types';

  type $$Props = PanelProps;

  export let position: $$Props['position'] = 'top-right';
  export let style: $$Props['style'] = undefined;

  let className: $$Props['class'] = undefined;
  export { className as class };

  $: positionClasses = `${position}`.split('-');
</script>

<div class={cc(['svelte-flow__panel', className, ...positionClasses])} {style} {...$$restProps}>
  <slot />
</div>

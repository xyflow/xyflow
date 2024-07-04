<script lang="ts">
  import cc from 'classcat';
  import type { PanelProps } from './types';
  import { useStore } from '$lib/store';

  type $$Props = PanelProps;

  export let position: $$Props['position'] = 'top-right';
  export let style: $$Props['style'] = undefined;

  let className: $$Props['class'] = undefined;
  export { className as class };

  const { selectionRectMode } = useStore();

  $: positionClasses = `${position}`.split('-');
</script>

<div
  class={cc(['svelte-flow__panel', className, ...positionClasses])}
  {style}
  style:pointer-events={$selectionRectMode ? 'none' : ''}
  {...$$restProps}
>
  <slot />
</div>

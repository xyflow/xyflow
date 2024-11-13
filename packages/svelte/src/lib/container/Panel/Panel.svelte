<script lang="ts">
  import cc from 'classcat';
  import type { PanelProps } from './types';
  import { useStore } from '$lib/store';

  let {
    position = 'top-right',
    style,
    class: className,
    children,
    ...restProps
  }: PanelProps = $props();

  const { selectionRectMode } = useStore();

  let positionClasses = $derived(`${position}`.split('-'));
</script>

<div
  class={cc(['svelte-flow__panel', className, ...positionClasses])}
  {style}
  style:pointer-events={$selectionRectMode ? 'none' : ''}
  {...restProps}
>
  {@render children?.()}
</div>

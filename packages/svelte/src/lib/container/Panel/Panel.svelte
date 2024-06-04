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

  let positionClasses = $derived(`${position}`.split('-'));

  let store = useStore();
</script>

<div
  class={cc(['svelte-flow__panel', className, ...positionClasses])}
  {style}
  style:pointer-events={store.selectionRectMode ? 'none' : undefined}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</div>

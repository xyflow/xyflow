<script lang="ts">
  import cc from 'classcat';
  import type { PanelProps } from './types';

  let {
    position = 'top-right',
    style,
    class: className,
    children,
    ...restProps
  }: PanelProps = $props();

  let positionClasses = $derived(`${position}`.split('-'));
</script>

<div class={cc(['svelte-flow__panel', className, ...positionClasses])} {style} {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</div>

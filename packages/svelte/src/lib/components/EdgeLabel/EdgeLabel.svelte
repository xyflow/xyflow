<script lang="ts">
  import { getContext } from 'svelte';
  import { portal } from '$lib/actions/portal';

  import { useStore } from '$lib/store';
  import type { EdgeLabelProps } from './types';

  let {
    x,
    y,
    selectEdgeOnClick = false,
    transparent = false,
    style,
    class: className,
    children,
    ...rest
  }: EdgeLabelProps = $props();

  const store = useStore();

  const id = getContext<string>('svelteflow__edge_id');
</script>

<div
  use:portal={'edgelabel'}
  class={['svelte-flow__edge-label', { transparent }, className]}
  style:cursor={selectEdgeOnClick ? 'pointer' : undefined}
  style:transform="translate(-50%, -50%) translate({x}px,{y}px)"
  style:pointer-events="all"
  {style}
  role="button"
  tabindex="-1"
  onclick={() => {
    if (selectEdgeOnClick && id) store.handleEdgeSelection(id);
  }}
  {...rest}
>
  {@render children?.()}
</div>

<style>
  .transparent {
    background: transparent;
  }
</style>

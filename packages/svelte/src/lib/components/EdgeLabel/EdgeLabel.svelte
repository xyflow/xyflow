<script lang="ts">
  import { getContext } from 'svelte';
  import { hideOnSSR, portal } from '$lib/actions/portal';

  import { useStore } from '$lib/store';
  import type { EdgeLabelProps } from './types';
  import { toPxString } from '$lib/utils';

  let {
    x = 0,
    y = 0,
    width,
    height,
    selectEdgeOnClick = false,
    transparent = false,
    class: className,
    children,
    ...rest
  }: EdgeLabelProps = $props();

  const store = useStore();

  const id = getContext<string>('svelteflow__edge_id');

  let z = $derived.by(() => {
    return store.visible.edges.get(id)?.zIndex;
  });
</script>

<div
  use:portal={'edge-labels'}
  style:display={hideOnSSR().value ? 'none' : undefined}
  class={['svelte-flow__edge-label', { transparent }, className]}
  style:cursor={selectEdgeOnClick ? 'pointer' : undefined}
  style:transform="translate(-50%, -50%) translate({x}px,{y}px)"
  style:pointer-events="all"
  style:width={toPxString(width)}
  style:height={toPxString(height)}
  style:z-index={z}
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

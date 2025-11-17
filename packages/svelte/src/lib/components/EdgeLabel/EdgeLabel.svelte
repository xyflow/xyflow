<script lang="ts">
  import { getEdgeIdContext } from '$lib/store/context';
  import { hideOnSSR, portal } from '$lib/actions/portal';
  import { useStore } from '$lib/store';
  import { toPxString } from '$lib/utils';

  import type { EdgeLabelProps } from './types';

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

  const edgeId = getEdgeIdContext('EdgeLabel must be used within a Custom Edge component');

  let z = $derived.by(() => {
    return store.visible.edges.get(edgeId)?.zIndex;
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
    if (selectEdgeOnClick && edgeId) store.handleEdgeSelection(edgeId);
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

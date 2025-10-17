<script lang="ts">
  import { Position, getEdgeToolbarTransform } from '@xyflow/system';
  import { getContext } from 'svelte';

  import { useSvelteFlow } from '$lib/hooks/useSvelteFlow.svelte';
  import { useStore } from '$lib/store';

  import { EdgeLabel } from '$lib/components/EdgeLabel';
  import type { EdgeToolbarProps } from './types';

  let {
    edgeId,
    position = Position.Top,
    align = 'center',
    x,
    y,
    offsetX = 0,
    offsetY = 0,
    isVisible,
    children,
    ...rest
  }: EdgeToolbarProps = $props();

  const store = useStore();

  const edge = store.edgeLookup.get(edgeId ?? '');

  // if isVisible is not set, we show the toolbar only if its node is selected and no other node is selected
  let isActive = $derived(typeof isVisible === 'boolean' ? isVisible : edge?.selected);

  let zIndex = (edge?.zIndex ?? 0) + 1;

  const { zoom } = store.viewport;

  const transform = getEdgeToolbarTransform(x, y, zoom, offsetX, offsetY);
</script>

{#if store.domNode && isActive}
  <EdgeLabel>
    <div
      style:position="absolute"
      style:transform
      style:z-index={zIndex}
      {...rest}
      class="svelte-flow__edge-toolbar"
      data-id={edgeId ?? ''}
    >
      {@render children?.()}
    </div>
  </EdgeLabel>
{/if}

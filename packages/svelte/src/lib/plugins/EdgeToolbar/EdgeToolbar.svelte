<script lang="ts">
  import { getEdgeToolbarTransform } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import { EdgeLabel } from '$lib/components/EdgeLabel';
  import type { EdgeToolbarProps } from './types';

  let {
    edgeId,
    x,
    y,
    alignX = 'center',
    alignY = 'center',
    isVisible,
    children,
    ...rest
  }: EdgeToolbarProps = $props();

  const store = useStore();
  const edge = store.edgeLookup.get(edgeId);
  const isActive = $derived(typeof isVisible === 'boolean' ? isVisible : edge?.selected);
  const transform = $derived(getEdgeToolbarTransform(x, y, store.viewport.zoom, alignX, alignY));
  const zIndex = (edge?.zIndex ?? 0) + 1;
</script>

{#if store.domNode && isActive}
  <EdgeLabel>
    <div
      style:position="absolute"
      style:transform
      style:z-index={zIndex}
      style:transform-origin="0 0"
      {...rest}
      class="svelte-flow__edge-toolbar"
      data-id={edgeId ?? ''}
    >
      {@render children?.()}
    </div>
  </EdgeLabel>
{/if}

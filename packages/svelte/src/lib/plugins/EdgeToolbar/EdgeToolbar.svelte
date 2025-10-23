<script lang="ts">
  import { getEdgeToolbarTransform } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import { getEdgeIdContext } from '$lib/store/context';

  import { EdgeLabel } from '$lib/components/EdgeLabel';
  import type { EdgeToolbarProps } from './types';

  let {
    x,
    y,
    alignX = 'center',
    alignY = 'center',
    isVisible,
    selectEdgeOnClick,
    class: className,
    children,
    ...rest
  }: EdgeToolbarProps = $props();

  const store = useStore();

  const edgeId = getEdgeIdContext('EdgeToolbar must be used within an edge');

  const isActive = $derived(
    typeof isVisible === 'boolean' ? isVisible : store.edgeLookup.get(edgeId)?.selected
  );
  const transform = $derived(getEdgeToolbarTransform(x, y, store.viewport.zoom, alignX, alignY));
</script>

{#if isActive}
  <EdgeLabel {selectEdgeOnClick} transparent>
    <div
      style:position="absolute"
      style:transform
      style:transform-origin="0 0"
      class={['svelte-flow__edge-toolbar', className]}
      data-id={edgeId}
      {...rest}
    >
      {@render children?.()}
    </div>
  </EdgeLabel>
{/if}

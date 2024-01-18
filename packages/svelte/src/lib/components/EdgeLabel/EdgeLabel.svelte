<script lang="ts">
  import { EdgeLabelRenderer } from '$lib/components/EdgeLabelRenderer';
  import { useHandleEdgeSelect } from '$lib/hooks/useHandleEdgeSelect';
  import { getContext } from 'svelte';
  import type { BaseEdgeProps } from '../BaseEdge/types';

  export let labelStyle: BaseEdgeProps['labelStyle'] = undefined;
  export let labelX: BaseEdgeProps['labelX'] = undefined;
  export let labelY: BaseEdgeProps['labelY'] = undefined;

  const handleEdgeSelect = useHandleEdgeSelect();

  const id = getContext<string>('svelteflow__edge_id');
</script>

<EdgeLabelRenderer>
  <div
    class="svelte-flow__edge-label"
    style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)"
    style={'pointer-events: all;' + labelStyle}
    on:click={() => {
      if (id) handleEdgeSelect(id);
    }}
  >
    <slot />
  </div>
</EdgeLabelRenderer>

<script lang="ts">
  import { getContext } from 'svelte';

  import { EdgeLabelRenderer } from '$lib/components/EdgeLabelRenderer';
  import { useHandleEdgeSelect } from '$lib/hooks/useHandleEdgeSelect';
  import type { BaseEdgeProps } from '$lib/components/BaseEdge/types';

  export let style: BaseEdgeProps['labelStyle'] = undefined;
  export let x: BaseEdgeProps['labelX'] = undefined;
  export let y: BaseEdgeProps['labelY'] = undefined;

  const handleEdgeSelect = useHandleEdgeSelect();

  const id = getContext<string>('svelteflow__edge_id');
</script>

<EdgeLabelRenderer>
  <div
    class="svelte-flow__edge-label"
    style:transform="translate(-50%, -50%) translate({x}px,{y}px)"
    style={'pointer-events: all;' + style}
    role="button"
    tabindex="-1"
    on:keyup={() => {}}
    on:click={() => {
      if (id) handleEdgeSelect(id);
    }}
  >
    <slot />
  </div>
</EdgeLabelRenderer>

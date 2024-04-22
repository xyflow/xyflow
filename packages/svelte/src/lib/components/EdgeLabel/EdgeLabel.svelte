<script lang="ts">
  import { getContext, type Snippet } from 'svelte';

  import { EdgeLabelRenderer } from '$lib/components/EdgeLabelRenderer';
  import { useHandleEdgeSelect } from '$lib/hooks/useHandleEdgeSelect';

  let {
    style,
    x,
    y,
    children
  }: {
    style?: string;
    x?: number;
    y?: number;
    children?: Snippet;
  } = $props();

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
    {#if children}
      {@render children()}
    {/if}
  </div>
</EdgeLabelRenderer>

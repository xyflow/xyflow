<script lang="ts">
  import { getContext, type Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  import { EdgeLabelRenderer } from '$lib/components/EdgeLabelRenderer';
  import { useStore } from '$lib/store';

  let {
    x,
    y,
    style,
    class: className,
    children
  }: {
    x?: number;
    y?: number;
    style?: string;
    class?: ClassValue;
    children?: Snippet;
  } = $props();

  const store = useStore();

  const id = getContext<string>('svelteflow__edge_id');
</script>

<EdgeLabelRenderer>
  <div
    class={['svelte-flow__edge-label', className]}
    style:transform="translate(-50%, -50%) translate({x}px,{y}px)"
    style={'pointer-events: all;' + style}
    role="button"
    tabindex="-1"
    onkeyup={() => {}}
    onclick={() => {
      if (id) store.handleEdgeSelection(id);
    }}
  >
    {@render children?.()}
  </div>
</EdgeLabelRenderer>

<script lang="ts">
  import { onDestroy } from 'svelte';

  import { NodeWrapper } from '$lib/components/NodeWrapper';

  import type { NodeEvents } from '$lib/types';
  import type { SvelteFlowStore } from '$lib/store/types';

  let {
    store = $bindable(),
    nodeClickDistance,
    onnodeclick,
    onnodecontextmenu,
    onnodepointerenter,
    onnodepointermove,
    onnodepointerleave,
    onnodedrag,
    onnodedragstart,
    onnodedragstop
  }: { store: SvelteFlowStore; nodeClickDistance?: number } & NodeEvents = $props();

  const resizeObserver: ResizeObserver | null =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver((entries: ResizeObserverEntry[]) => {
          const updates = new Map();

          entries.forEach((entry: ResizeObserverEntry) => {
            const id = entry.target.getAttribute('data-id') as string;

            updates.set(id, {
              id,
              nodeElement: entry.target as HTMLDivElement,
              force: true
            });
          });

          store.updateNodeInternals(updates);
        });

  onDestroy(() => {
    resizeObserver?.disconnect();
  });
</script>

{#each store.visible.nodes.values() as node (node.id)}
  <NodeWrapper
    bind:store
    {node}
    {resizeObserver}
    {nodeClickDistance}
    {onnodeclick}
    {onnodepointerenter}
    {onnodepointermove}
    {onnodepointerleave}
    {onnodedrag}
    {onnodedragstart}
    {onnodedragstop}
    {onnodecontextmenu}
  />
{/each}

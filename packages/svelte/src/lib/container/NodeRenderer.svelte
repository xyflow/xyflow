<script lang="ts">
  import { onDestroy } from 'svelte';

  import Node from '$lib/components/nodes/BaseNode.svelte';
  import { useStore } from '$lib/store';

  const { nodesStore, updateNodeDimensions } = useStore();
  const resizeObserver: ResizeObserver | null = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver((entries: ResizeObserverEntry[]) => {
    const updates = entries.map((entry: ResizeObserverEntry) => ({
      id: entry.target.getAttribute('data-id') as string,
      nodeElement: entry.target as HTMLDivElement,
      forceUpdate: true,
    }))

    updateNodeDimensions(updates);
  });

  onDestroy(() => {
    resizeObserver?.disconnect();
  });
</script>

<div class="react-flow__nodes">
  {#each $nodesStore as node}
    <Node {...node} {resizeObserver} />
  {/each}
</div>

<style>
  .react-flow__nodes {
    width: 100%;
    height: 100%;
  }
</style>
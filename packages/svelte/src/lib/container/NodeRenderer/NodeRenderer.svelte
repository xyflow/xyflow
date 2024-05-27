<script lang="ts">
  import { onDestroy } from 'svelte';
  import { useStore } from '$lib/store';
  import type { NodeEvents } from '$lib/types/events';
  import type { Node } from '$lib/types';
  import NodeUpdate from './NodeUpdate.svelte';

  let {
    nodes,
    onnodeclick,
    onnodemouseenter,
    onnodemousemove,
    onnodemouseleave,
    onnodedrag,
    onnodedragstart,
    onnodedragstop,
    onnodecontextmenu
  }: NodeEvents & { nodes: Node[] } = $props();

  const store = useStore();

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

<!-- TODO: render visibleNodes -->
<div class="svelte-flow__nodes">
  {#each nodes as userNode (userNode.id)}
    <NodeUpdate
      id={userNode.id}
      {userNode}
      {resizeObserver}
      {onnodeclick}
      {onnodemouseenter}
      {onnodemousemove}
      {onnodemouseleave}
      {onnodedrag}
      {onnodedragstart}
      {onnodedragstop}
      {onnodecontextmenu}
    />
  {/each}
</div>

<style>
  .svelte-flow__nodes {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
</style>

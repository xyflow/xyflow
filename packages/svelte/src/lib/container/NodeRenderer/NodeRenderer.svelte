<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import { onDestroy } from 'svelte';

  import { NodeWrapper } from '$lib/components/NodeWrapper';

  import type { Node, Edge, NodeEvents } from '$lib/types';
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
  }: {
    store: SvelteFlowStore<NodeType, EdgeType>;
    nodeClickDistance?: number;
  } & NodeEvents<NodeType> = $props();

  const resizeObserver: ResizeObserver | null =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver((entries: ResizeObserverEntry[]) => {
          // eslint-disable-next-line svelte/prefer-svelte-reactivity
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

<div class="svelte-flow__nodes">
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
</div>

<script lang="ts">
  import { Background, BackgroundVariant, Controls, MiniMap, NodeToolbar, SvelteFlow } from '@xyflow/svelte';

  import DemoToolbarNode from './DemoToolbarNode.svelte';
  import { type NodeToolbarStoryArgs } from './config';

  const DEMO_NODE_ID = 'demo-node';

  let {
    isVisible,
    position = 'top',
    offset = 10,
    align = 'center',
    nodeId,
    renderMode = 'inside-node',
  }: NodeToolbarStoryArgs = $props();

  const nodeTypes = { DemoToolbarNode };
  const externalNodeId = $derived(nodeId || DEMO_NODE_ID);

  let nodes = $state.raw([
    {
      id: DEMO_NODE_ID,
      type: 'DemoToolbarNode',
      position: { x: 250, y: 200 },
      data: {
        label: 'Select or interact with this node',
        isVisible,
        position,
        offset,
        align,
        renderMode,
      },
    },
  ]);
  let edges = $state.raw([]);

  $effect(() => {
    nodes = [
      {
        id: DEMO_NODE_ID,
        type: 'DemoToolbarNode',
        position: { x: 250, y: 200 },
        data: {
          label: 'Select or interact with this node',
          isVisible,
          position,
          offset,
          align,
          renderMode,
        },
      },
    ];
  });
</script>

<div class="flow-story">
  <SvelteFlow bind:nodes bind:edges {nodeTypes} fitView minZoom={0.5} maxZoom={2}>
    <Background variant={BackgroundVariant.Dots} />
    <MiniMap />
    <Controls />
    {#if renderMode === 'external'}
      <NodeToolbar nodeId={externalNodeId} {isVisible} {position} {offset} {align}>
        <button type="button">delete</button>
        <button type="button">copy</button>
        <button type="button">expand</button>
      </NodeToolbar>
    {/if}
  </SvelteFlow>
</div>

<style>
  .flow-story {
    width: 100%;
    height: 100%;
  }

  .flow-story :global(.svelte-flow) {
    width: 100%;
    height: 100%;
  }
</style>

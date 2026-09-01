<script lang="ts">
  import { Background, BackgroundVariant, NodeToolbar, SvelteFlow } from '@xyflow/svelte';

  import ToolbarNode from './ToolbarNode.svelte';
  import { DEMO_NODE_ID, demoNode, type NodeToolbarStoryArgs } from './config';

  let {
    isVisible,
    position = 'top',
    offset = 10,
    align = 'center',
    nodeId,
    renderMode = 'inside-node',
  }: NodeToolbarStoryArgs = $props();

  const nodeTypes = { ToolbarNode };
  const externalNodeId = $derived(nodeId || DEMO_NODE_ID);
  const showExternalToolbar = $derived(renderMode === 'external');

  let nodes = $state.raw([demoNode({ isVisible, position, offset, align, renderMode })]);
  let edges = $state.raw([]);

  $effect(() => {
    nodes = [demoNode({ isVisible, position, offset, align, renderMode })];
  });
</script>

<div class="flow-story">
  <SvelteFlow bind:nodes bind:edges {nodeTypes} fitView minZoom={0.5} maxZoom={2}>
    <Background variant={BackgroundVariant.Dots} />
    {#if showExternalToolbar}
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

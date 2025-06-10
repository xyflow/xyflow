<script lang="ts">
  import { SvelteFlow, Controls, Background, BackgroundVariant, type Node, type Edge } from '@xyflow/svelte';

  import '@xyflow/svelte/dist/style.css';
  import CustomNode from './CustomNode.svelte';

  let nodes = $state.raw<Node[]>([
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: {},
      initialWidth: 100,
      initialHeight: 40,
      type: 'input-node',
    },
    {
      id: '2',
      position: { x: 0, y: 150 },
      data: {},
      initialWidth: 100,
      initialHeight: 40,
      type: 'input-node',
    },
  ]);

  let edges = $state.raw<Edge[]>([{ id: '1-2', source: '1', target: '2' }]);

  const nodeTypes = {
    'input-node': CustomNode,
  };
</script>

<div style="height: 400px; width: 700px;">
  <SvelteFlow bind:nodes bind:edges {nodeTypes} fitView width={700} height={400}>
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
  </SvelteFlow>
</div>

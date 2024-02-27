<script lang="ts">
  import { writable } from 'svelte/store';
  import { SvelteFlow, Controls, Background, BackgroundVariant, type Node, type Edge } from '@xyflow/svelte';

  import '@xyflow/svelte/dist/style.css';
  import CustomNode from './CustomNode.svelte';

  const nodes = writable<Node[]>([
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

  const edges = writable<Edge[]>([{ id: '1-2', source: '1', target: '2' }]);

  const nodeTypes = {
    'input-node': CustomNode,
  };
</script>

<div style="height: 400px; width: 700px;">
  <SvelteFlow {nodes} {edges} {nodeTypes} fitView width={700} height={400}>
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
  </SvelteFlow>
</div>

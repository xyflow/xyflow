<script lang="ts">
  import {
    createEdges,
    createNodes,
    SvelteFlowProvider,
  } from '../../lib/index';

  import Flow from './Flow.svelte';

  const nodes = createNodes([
    {
      id: '1',
      type: 'input',
      data: { label: 'Input Node' },
      position: { x: 150, y: 5 }
    },
    {
      id: '2',
      type: 'default',
      data: { label: 'Node' },
      position: { x: 0, y: 150 }
    },
    {
      id: '3',
      type: 'output',
      data: { label: 'Output Node' },
      position: { x: 300, y: 150 }
    }
  ]);

  const edges = createEdges([
    {
      id: '1-2',
      type: 'default',
      source: '1',
      target: '2',
      label: 'Edge Text'
    },
    {
      id: '1-3',
      type: 'smoothstep',
      source: '1',
      target: '3'
    }
  ]);
</script>

<SvelteFlowProvider
  {nodes}
  {edges}
>
  <Flow />
</SvelteFlowProvider>

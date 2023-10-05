<script lang="ts">
  import { writable } from 'svelte/store';
  import { SvelteFlow, Controls, Background, BackgroundVariant, Position } from '@xyflow/svelte';

  import '@xyflow/svelte/dist/style.css';

  const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    dimensions: {
      width: 100,
      height: 40,
    },
    handles: [
      { type: 'source', x: 100, y: 20, position: Position.Right, width: 1, height: 1 },
      { type: 'target', x: 0, y: 20, position: Position.Left, width: 1, height: 1 },
    ],
  };

  const nodes = writable([
    {
      id: '0',
      position: { x: 0, y: 150 },
      data: { label: 'Node 0' },
      ...nodeDefaults,
    },
    { id: 'A', position: { x: 250, y: 0 }, data: { label: 'A' }, ...nodeDefaults },
    { id: 'B', position: { x: 250, y: 150 }, data: { label: 'B' }, ...nodeDefaults },
    { id: 'C', position: { x: 250, y: 300 }, data: { label: 'C' }, ...nodeDefaults },
  ]);

  const edges = writable([
    { id: '0A', source: '0', target: 'A', animated: true },
    { id: '0B', source: '0', target: 'B', animated: true },
    { id: '0C', source: '0', target: 'C', animated: true },
  ]);

  const defaultEdgeOptions = {
    animated: true,
  };
</script>

<SvelteFlow {nodes} {edges} fitView {defaultEdgeOptions}>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
</SvelteFlow>

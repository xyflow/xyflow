<script lang="ts">
  import { writable } from 'svelte/store';
  import { SvelteFlow, Controls, Background, BackgroundVariant, Position, type Node, type Edge } from '@xyflow/svelte';

  import '@xyflow/svelte/dist/style.css';

  const nodes = writable<Node[]>([
    {
      id: '0',
      position: { x: 0, y: 150 },
      data: { label: 'Node 0' },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      width: 100,
      height: 40,
      handles: [
        { type: 'source', x: 100, y: 20, position: Position.Right },
        { type: 'target', x: 0, y: 20, position: Position.Left },
      ],
    },
    {
      id: 'A',
      position: { x: 250, y: 0 },
      data: { label: 'A' },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      width: 100,
      height: 40,
      handles: [
        { type: 'source', x: 100, y: 20, position: Position.Right },
        { type: 'target', x: 0, y: 20, position: Position.Left },
      ],
    },
    {
      id: 'B',
      position: { x: 250, y: 150 },
      data: { label: 'B' },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      width: 100,
      height: 40,
      handles: [
        { type: 'source', x: 100, y: 20, position: Position.Right },
        { type: 'target', x: 0, y: 20, position: Position.Left },
      ],
    },
    {
      id: 'C',
      position: { x: 250, y: 300 },
      data: { label: 'C' },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      width: 100,
      height: 40,
      handles: [
        { type: 'source', x: 100, y: 20, position: Position.Right },
        { type: 'target', x: 0, y: 20, position: Position.Left },
      ],
    },
  ]);

  const edges = writable<Edge[]>([
    { id: '0A', source: '0', target: 'A', animated: true },
    { id: '0B', source: '0', target: 'B', animated: true },
    { id: '0C', source: '0', target: 'C', animated: true },
  ]);

  const defaultEdgeOptions = {
    animated: true,
  };
</script>

<div style="height: 400px; width: 700px;">
  <SvelteFlow {nodes} {edges} fitView {defaultEdgeOptions} width={700} height={400}>
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
  </SvelteFlow>
</div>

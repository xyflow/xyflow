<script lang="ts">
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    Position,
    ViewportPortal,
    type Node,
    type Edge,
  } from '@xyflow/svelte';

  import '@xyflow/svelte/dist/style.css';

  let nodes = $state.raw<Node[]>([
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
      position: { x: 950, y: 300 },
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

  let edges = $state.raw<Edge[]>([
    { id: '0A', source: '0', target: 'A', animated: true },
    { id: '0B', source: '0', target: 'B', animated: true },
    { id: '0C', source: '0', target: 'C', animated: true },
  ]);

  const defaultEdgeOptions = {
    animated: true,
  };
</script>

<div style="height: 400px; width: 700px;">
  <SvelteFlow bind:nodes bind:edges onlyRenderVisibleElements {defaultEdgeOptions} width={700} height={400}>
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
    <ViewportPortal target="front">
      <div style:transform="translate(100px, 100px)" style:position="absolute">[100, 100] inside the flow.</div>
    </ViewportPortal>
  </SvelteFlow>
</div>

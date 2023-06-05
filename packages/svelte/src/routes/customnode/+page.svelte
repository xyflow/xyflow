<script lang="ts">
  import type { ChangeEventHandler } from 'svelte/elements';
  import { writable } from 'svelte/store';
  import SvelteFlow, {
    SvelteFlowProvider,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    createNodes,
    createEdges,
    type NodeTypes,
    Position
  } from '../../lib/index';
  import { CustomNode } from './CustomNode';

  const nodeTypes: NodeTypes = {
    colorNode: CustomNode
  };

  const bgColor = writable('#1A192B')
  
  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    nodes.update((nds) =>
      nds.map((node) => {
        if (node.id !== '2') {
          return node;
        }

        const color = (event.target as HTMLInputElement)?.value;

        bgColor.set(color);

        return {
          ...node,
          data: {
            ...node.data,
            color,
          },
        };
      })
    );
  };

  const nodes = createNodes([
  {
    id: '1',
    type: 'input',
    data: { label: 'An input node' },
    position: { x: 0, y: 50 },
    sourcePosition: Position.Right,
  },
  {
    id: '2',
    type: 'colorNode',
    data: { onChange: onChange, color: $bgColor },
    style: 'border: 1px solid #777; padding: 10px',
    position: { x: 250, y: 50 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output A' },
    position: { x: 650, y: 25 },
    targetPosition: Position.Left,
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Output B' },
    position: { x: 650, y: 120 },
    targetPosition: Position.Left,
  },
  ]);

  const edges = createEdges([
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
    },
    {
      id: 'e2a-3',
      source: '2',
      sourceHandle: 'a',
      target: '3',
      animated: true,
    },
    {
      id: 'e2b-4',
      source: '2',
      sourceHandle: 'b',
      target: '4',
      animated: true,
    },
  ], { animated: true });
</script>

<SvelteFlowProvider
  {nodes}
  {edges}
>
  <SvelteFlow
    {nodeTypes}
    style="--bgcolor: {$bgColor}"
    fitView
  >
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
    <MiniMap />
  </SvelteFlow>
</SvelteFlowProvider>

<style>
  :global(.svelte-flow) {
    background: var(--bgcolor);
  }
</style>

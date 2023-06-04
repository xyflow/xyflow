# SvelteFlow

A highly customizable Svelte component for building interactive graphs and node-based editors. **This package is currently under heavy development and the API is very likely to change.**

## Getting started

If you want to check out the current version you need to run the following command from the root directory:

1. `pnpm install` - installs dependencies
2. `pnpm build` - needs to be done once
3. `pnpm dev` - starts dev server

You can now access the examples under http://127.0.0.1:5173

## A basic flow 

A basic flow looks like this:

```svelte
<script lang="ts">
  import SvelteFlow, {
    SvelteFlowProvider,
    Controls,
    Background,
    BackgroundVariant,
    Minimap,
    Panel,
    createNodes,
    createEdges,
    type NodeTypes
  } from '../../lib/index';
  import { CustomNode } from './CustomNode';

  const nodeTypes: NodeTypes = {
    custom: CustomNode
  };
  
  const nodes = createNodes([
    {
      id: '1',
      type: 'input',
      data: { label: 'Input Node' },
      position: { x: 0, y: 0 }
    },
    {
      id: '2',
      type: 'custom',
      data: { label: 'Node' },
      position: { x: 0, y: 150 }
    }
  ], { style: 'width: 125px;' });

  const edges = createEdges([
    {
      id: '1-2',
      type: 'default',
      source: '1',
      target: '2',
      label: 'Edge Text'
    }
  ], { animated: true });
</script>

<SvelteFlowProvider
  {nodes}
  {edges}
>
  <SvelteFlow
    {nodeTypes}
    fitView
    snapGrid={[25, 25]}
    on:node:click={(event) => console.log('on node click', event)}
  >
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
    <Minimap />
  </SvelteFlow>
</SvelteFlowProvider>
```

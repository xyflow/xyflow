# SvelteFlow

A highly customizable Svelte component for building interactive graphs and node-based editors. **This package is currently under heavy development and the API is very likely to change.**

## Getting started

If you want to check out the current version you need to run the following command from the root directory:

1. `pnpm install` - install dependencies
2. `pnpm build` - needs to be done once
3. `pnpm dev` - starts dev server

You can now access the examples under http://127.0.0.1:5173

## Getting started

We are working on a new website and everything so there are no docs for Svelte Flow yet. Everything is typed, so your IDE should help you a bit and you can also the [React Flow docs](https://reactflow.dev/docs) because the API is very similar. You can also check out the [Svelte Flow examples](/packages/svelte/src/routes) in this repo.

A basic flow looks like this:

```svelte
<script lang="ts">
  import { writable } from 'svelte/store';
  import SvelteFlow, {
    SvelteFlowProvider,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    Panel,
    type NodeTypes
  } from '../../lib/index';
  import { CustomNode } from './CustomNode';

  // Svelte Flow is highly customizable, a node can be anything that fits in a div
  const nodeTypes: NodeTypes = {
    custom: CustomNode
  };
  
  // We are using writables for the nodes and edges to sync them easily. When a user drags a node for example, Svelte Flow updates its position.
  // This also makes it easier to update nodes in user land.
  const nodes = writable([
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
  ]);

  // same for edges
  const edges = writable([
    {
      id: '1-2',
      type: 'default',
      source: '1',
      target: '2',
      label: 'Edge Text'
    }
  ]);

  const snapGrid = [25, 25];
</script>

<SvelteFlow
  {nodes}
  {edges}
  {nodeTypes}
  fitView
  snapGrid={snapGrid}
  on:node:click={(event) => console.log('on node click', event)}
>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
  <MiniMap />
</SvelteFlow>
```

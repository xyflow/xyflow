# Svelte Flow (alpha)

Svelte Flow is a highly customizable component for building interactive graphs and node-based editors, built by the creators of React Flow. **This package is currently under heavy development and the API is very likely to change.**

## Installation

The easiest way to get the latest version of Svelte Flow is to install it via npm, yarn or pnpm:

```sh
npm install @xyflow/svelte
```

What is “xyflow”? Learn more [here](https://wbkd.notion.site/Upcoming-Changes-at-React-Flow-1a443641891a4069927c0a115e915251).

## Getting started

We are working on a new website and everything so there are no docs for Svelte Flow yet. Everything is typed, so your IDE should help you a bit and you can also the [React Flow docs](https://reactflow.dev/docs) because the API is very similar. You can also check out the [Svelte Flow examples](/packages/svelte/src/routes) in this repo.
If you want to start right away you can check out the [Svelte Flow examples Stackblitz project](https://stackblitz.com/edit/svelte-flow-examples?file=src%2Froutes%2Foverview%2F%2Bpage.svelte). 

A basic flow looks like this:

```svelte
<script lang="ts">
  import { writable } from 'svelte/store';
  import {
    SvelteFlow,
    SvelteFlowProvider,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    Panel,
    type NodeTypes
  } from '@xyflow/svelte';
  
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

## How to Contribute

**Show us what you make:** Drop it in into our [Discord Server](https://discord.com/invite/Bqt6xrs), [tweet](https://twitter.com/reactflowdev) at us, or email us at info@reactflow.dev

**Community Participation:** Ask and answer questions in our [Discord Server](https://discord.com/invite/Bqt6xrs) or jump in on Github discussions.

**Squash Bugs:** We can’t catch them all. Check existing issues and discussions first, then create a new issue to tell us what’s up.

**Financial Support:** If you are an organization who wants to make sure Svelte Flow continues to be maintained, reach out to us at info@reactflow.dev

And of course, we love Github stars ⭐


## Development

If you want to check out the current version you need to run the following command from the root directory:

1. `pnpm install` - install dependencies
2. `pnpm build` - needs to be done once
3. `pnpm dev` - starts dev server

You can now access the examples under http://127.0.0.1:5173


# License

Svelte Flow is MIT Licensed.
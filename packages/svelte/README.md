![readme-header](https://user-images.githubusercontent.com/2857535/279691030-dd853bef-88c5-433b-a51a-10294dc82d2b.svg#gh-light-mode-only)
![readme-header-dark](https://user-images.githubusercontent.com/2857535/279691048-accf12e0-da89-4c79-8d66-dee0c43585cd.svg#gh-dark-mode-only)

<div align="center">

![GitHub License MIT](https://img.shields.io/github/license/wbkd/react-flow?color=%23ff0072)
![npm downloads](https://img.shields.io/npm/dt/@xyflow/svelte?color=%23FF0072&label=downloads)

Svelte Flow is a highly customizable component for building interactive graphs and node-based editors, built by the creators of React Flow.

☣️ **Svelte Flow is still alpha and currently under heavy development. The API is relatively stable but some things might change.** ☣️

[🚀 Getting Started](https://svelteflow.dev/learn) | [📖 Documentation](https://svelteflow.dev/api-reference/svelte-flow) | [📺 Examples](https://svelteflow.dev/examples/overview) | [☎️ Discord](https://discord.gg/RVmnytFmGW)

</div>

## Key Features

- **Easy to use:** Seamless zooming and panning, single- and multi selection of graph elements and keyboard shortcuts are supported out of the box
- **Customizable:** Different [node](https://svelteflow.dev/examples) and [edge types](https://svelteflow.dev/examples/edges/edge-types) and support for custom nodes with multiple handles and custom edges
- **Fast rendering:** Only nodes that have changed are re-rendered
- **Hooks and Utils:** [Hooks](https://svelteflow.dev/api-reference/hooks) for handling nodes, edges and the viewport and graph [helper functions](https://svelteflow.dev/api-reference/utils)
- **Plugin Components:** [Background](https://svelteflow.dev/api-reference/components/background), [MiniMap](https://svelteflow.dev/api-reference/components/minimap) and [Controls](https://svelteflow.dev/api-reference/components/controls)
- **Reliable**: Written in [Typescript](https://www.typescriptlang.org) and tested with [Playwright](https://www.playwright.dev)

## Installation

The easiest way to get the latest version of Svelte Flow is to install it via npm, yarn or pnpm:

```sh
npm install @xyflow/svelte
```

## Getting started

You only need a few lines to get a fully interactive (e.g. select and drag nodes or pan and zoom) flow. If you want to learn more, please refer to the [learn section](https://svelteflow.dev/learn), the [examples](https://svelteflow.dev/examples) or the [API reference](https://svelteflow.dev/api-reference).

```svelte
<script lang="ts">
  import { writable } from 'svelte/store';
  import { SvelteFlow, Controls, Background, BackgroundVariant, MiniMap } from '@xyflow/svelte';

  // you need to import the styles for Svelte Flow to work
  // if you just want to load the basic styleds, you can import '@xyflow/svelte/dist/base.css'
  import '@xyflow/svelte/dist/style.css';

  // We are using writables for the nodes and edges to sync them easily. When a user drags a node for example, Svelte Flow updates its position. This also makes it easier to update nodes in user land.
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
</script>

<SvelteFlow {nodes} {edges} fitView on:nodeclick={(event) => console.log('on node click', event)}>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
  <MiniMap />
</SvelteFlow>
```

## How to Contribute

**Show us what you make:** Drop it in into our [Discord Server](https://discord.com/invite/Bqt6xrs), [tweet](https://twitter.com/reactflowdev) at us, or email us at info@xyflow.com

**Community Participation:** Ask and answer questions in our [Discord Server](https://discord.com/invite/Bqt6xrs) or jump in on Github discussions.

**Squash Bugs:** We can’t catch them all. Check existing issues and discussions first, then create a new issue to tell us what’s up.

**Financial Support:** If you are an organization who wants to make sure Svelte Flow continues to be maintained, reach out to us at info@xyflow.com

And of course, we love Github stars ⭐

## Development

If you want to check out the current version you need to run the following command from the root directory:

1. `pnpm install` - install dependencies
2. `pnpm build` - needs to be done once
3. `pnpm dev` - starts dev server

You can now access the examples under http://127.0.0.1:5173

## Maintainers

Svelte Flow is maintained by the team behind [xyflow](https://xyflow.com). If you need help or want to talk to us about a collaboration, reach out through our [contact form](https://xyflow.com/contact) or by joining our [Discord Server](https://discord.gg/Bqt6xrs).

- Christopher • [Twitter](https://twitter.com/chrtze) • [Github](https://github.com/chrtze)
- Hayleigh • [Twitter](https://twitter.com/hayleighdotdev) • [Github](https://github.com/hayleigh-dot-dev)
- John • [Website](https://johnrobbdesign.com/) • [Mastodon](https://mastodon.social/@johnrobbjr)
- Moritz • [Twitter](https://twitter.com/moklick) • [Github](https://github.com/moklick)
- Peter • [Github](https://github.com/peterkogo)

# License

Svelte Flow is [MIT licensed](../../LICENSE).

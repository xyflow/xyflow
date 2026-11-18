<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/xyflow/xyflow/main/packages/vue/assets/readme-header-dark.svg">
  <img alt="Vue Flow" src="https://raw.githubusercontent.com/xyflow/xyflow/main/packages/vue/assets/readme-header.svg">
</picture>

<div align="center">

![GitHub License MIT](https://img.shields.io/github/license/xyflow/xyflow?color=%23ff0072)
![npm downloads](https://img.shields.io/npm/dt/@xyflow/vue?color=%23FF0072&label=downloads)

Vue Flow is a highly customizable component for building interactive graphs and node-based editors, built by the creators of React Flow and Svelte Flow.

[🚀 Getting Started](https://vueflow.dev/learn) | [📖 Documentation](https://vueflow.dev/api-reference/vue-flow) | [📺 Examples](https://vueflow.dev/examples/overview) | [☎️ Discord](https://discord.gg/RVmnytFmGW)

</div>

## Key Features

- **Easy to use:** Seamless zooming and panning, single- and multi selection of graph elements and keyboard shortcuts are supported out of the box
- **Customizable:** Different [node](https://vueflow.dev/examples) and [edge types](https://vueflow.dev/examples/edges/edge-types) and support for custom nodes with multiple handles and custom edges
- **Fast rendering:** Only nodes that have changed are re-rendered
- **Composables and Utils:** [Composables](https://vueflow.dev/api-reference/composables) for handling nodes, edges and the viewport and graph [helper functions](https://vueflow.dev/api-reference/utils)
- **Plugin Components:** [Background](https://vueflow.dev/api-reference/components/background), [MiniMap](https://vueflow.dev/api-reference/components/minimap) and [Controls](https://vueflow.dev/api-reference/components/controls)
- **Reliable**: Written in [Typescript](https://www.typescriptlang.org) and tested with [Playwright](https://www.playwright.dev)

## Installation

The easiest way to get the latest version of Vue Flow is to install it via npm, yarn or pnpm:

```sh
npm install @xyflow/vue
```

## Getting started

You only need a few lines to get a fully interactive (e.g. select and drag nodes or pan and zoom) flow. If you want to learn more, please refer to the [learn section](https://vueflow.dev/learn), the [examples](https://vueflow.dev/examples) or the [API reference](https://vueflow.dev/api-reference).

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { VueFlow, Background, Controls, MiniMap, addEdge, type Connection, type Edge, type Node } from '@xyflow/vue';

// you need to import the styles for Vue Flow to work
// if you just want to load the basic styles, you can import '@xyflow/vue/base.css'
import '@xyflow/vue/style.css';

const nodes = ref<Node[]>([
  { id: '1', type: 'input', data: { label: 'Input Node' }, position: { x: 0, y: 0 } },
  { id: '2', data: { label: 'Node' }, position: { x: 0, y: 150 } },
]);

const edges = ref<Edge[]>([{ id: '1-2', source: '1', target: '2', label: 'Edge Text' }]);

function onConnect(connection: Connection) {
  edges.value = addEdge(connection, edges.value);
}
</script>

<template>
  <div style="width: 100vw; height: 100vh">
    <!-- v-model keeps nodes and edges in sync, e.g. when a user drags a node -->
    <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view @connect="onConnect">
      <Background />
      <Controls />
      <MiniMap />
    </VueFlow>
  </div>
</template>
```

## How to Contribute

**Show us what you make:** Drop it in into our [Discord Server](https://discord.com/invite/Bqt6xrs), [tweet](https://twitter.com/xyflowdev) at us, or email us at info@xyflow.com

**Community Participation:** Ask and answer questions in our [Discord Server](https://discord.com/invite/Bqt6xrs) or jump in on Github discussions.

**Squash Bugs:** We can’t catch them all. Check existing issues and discussions first, then create a new issue to tell us what’s up.

**Financial Support:** If you are an organization who wants to make sure Vue Flow continues to be maintained, reach out to us at info@xyflow.com

And of course, we love Github stars ⭐

## Development

If you want to check out the current version you need to run the following command from the root directory:

1. `pnpm install` - install dependencies
2. `pnpm build` - needs to be done once
3. `pnpm dev:vue` - starts dev server

## Maintainers

Vue Flow is maintained by the team behind [xyflow](https://xyflow.com). If you need help or want to talk to us about a collaboration, reach out through our [contact form](https://xyflow.com/contact) or by joining our [Discord Server](https://discord.gg/Bqt6xrs).

Vue Flow was originally created by [Burak Cakmakoglu](https://github.com/bcakmakoglu).

## License

Vue Flow is [MIT licensed](../../LICENSE).

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/36e3324c-f7c7-40be-8263-9a1d8f320887">
  <img alt="xyflow: React Flow, Svelte Flow and Vue Flow" src="https://github.com/user-attachments/assets/4a696428-e0eb-4ea8-a1fe-67393b62e09d">
</picture>

<div align="center">

![GitHub License MIT](https://img.shields.io/github/license/wbkd/react-flow?color=%23ff0072)
![npm downloads](https://img.shields.io/npm/dt/reactflow?color=%23FF0072&label=React%20Flow%20downloads)
![npm downloads](https://img.shields.io/npm/dt/@xyflow/svelte?color=%23FF3E00&label=Svelte%20Flow%20downloads)

Powerful open source libraries for building node-based UIs with React, Svelte and Vue. Ready out-of-the-box and infinitely customizable.

[React Flow](https://reactflow.dev/) · [Svelte Flow](https://svelteflow.dev/) · [Vue Flow](https://vueflow.dev/) · [React Flow Pro](https://reactflow.dev/pro) · [Discord](https://discord.gg/Bqt6xrs)
</div>

---

## The xyflow mono repo

The xyflow repository is the home of several packages:
* React Flow `@xyflow/react` [packages/react](./packages/react)
* Svelte Flow `@xyflow/svelte` [packages/svelte](./packages/svelte)
* Vue Flow `@xyflow/vue` [packages/vue](./packages/vue)
* Shared helper library `@xyflow/system` [packages/system](./packages/system)
* React Flow 11 (legacy package) `reactflow` [v11 branch](https://github.com/xyflow/xyflow/tree/v11)

## Attribution and support

React Flow, Svelte Flow and Vue Flow show a small attribution link in the corner of the canvas. **If you remove it, we ask you to subscribe** – no matter if you are building a side project, an internal tool or a commercial product. Subscriptions are how we keep our libraries developed and maintained under an MIT license, just how we like it.

- [Remove the attribution in React Flow](https://reactflow.dev/remove-attribution)
- [Remove the attribution in Svelte Flow](https://svelteflow.dev/remove-attribution)
- [Remove the attribution in Vue Flow](https://vueflow.dev/remove-attribution)

This is a support expectation, not a legal requirement: the MIT license does not require you to pay or to keep the attribution. If you keep it, you can still support us by reporting bugs, building something for the ecosystem, starring us on GitHub 🌟 or sponsoring us via [GitHub Sponsors](https://github.com/sponsors/xyflow).

## Getting started

The best way to get started is to check out the [React Flow](https://reactflow.dev/learn), [Svelte Flow](https://svelteflow.dev/learn) or [Vue Flow](https://vueflow.dev/learn) learn section. However if you want to get a sneak peek of how to install and use the libraries you can see it here: 

<details>
  <summary><strong>React Flow</strong> basic usage</summary>

  ### Installation
  
  ```sh
npm install @xyflow/react
  ```

  ### Basic usage
  ```jsx
import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge
} from '@xyflow/react';

import '@xyflow/react/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } }
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onConnect= useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const onNodesChange = useCallback((changes) => setNodes(nds => changes.applyTo(nds)));
  const onEdgesChange= useCallback((changes) => setEdges(eds => changes.applyTo(eds)));

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}

export default Flow;
```
</details>

<details>
  <summary><strong>Svelte Flow</strong> basic usage</summary>

  ### Installation
  
  ```sh
npm install @xyflow/svelte
  ```

  ### Basic usage
  ```svelte
<script lang="ts">
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
  } from '@xyflow/svelte';

  import '@xyflow/svelte/style.css'
  
  const nodes = $state.raw([
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

  const edges = $state.raw([
    {
      id: '1-2',
      type: 'default',
      source: '1',
      target: '2',
      label: 'Edge Text'
    }
  ]);
</script>

<SvelteFlow
  bind:nodes
  bind:edges
  fitView
  on:nodeclick={(event) => console.log('on node click', event)}
>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
  <MiniMap />
</SvelteFlow>
```
</details>

## Releases 

For releasing packages we are using [changesets](https://github.com/changesets/changesets) in combination with the [changeset Github action](https://github.com/changesets/action). The rough idea is:

1. create PRs for new features, updates and fixes (with a changeset if relevant for changelog)
2. merge into main 
3. changeset creates a PR that bumps all packages based on the changesets 
4. merge changeset PR if you want to release to Github and npm

## Built by [xyflow](https://xyflow.com)

React Flow, Svelte Flow and Vue Flow are maintained by the [xyflow team](https://xyflow.com/about). If you need help or want to talk to us about a collaboration, reach out through our [contact form](https://xyflow.com/contact) or by joining our [Discord Server](https://discord.gg/Bqt6xrs).

## License

React Flow, Svelte Flow and Vue Flow are [MIT licensed](./LICENSE).

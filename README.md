![xyflow-readme](https://github.com/wbkd/react-flow/assets/2857535/5504f9d5-adbd-47c6-b3ce-8abccb5fb4a4)

<div align="center">

![GitHub License MIT](https://img.shields.io/github/license/wbkd/react-flow?color=%23ff0072)
![npm downloads](https://img.shields.io/npm/dt/reactflow?color=%23FF0072&label=React%20Flow%20downloads)
![npm downloads](https://img.shields.io/npm/dt/@xyflow/svelte?color=%23FF3E00&label=Svelte%20Flow%20downloads)
![GitHub Repo stars](https://img.shields.io/github/stars/wbkd/react-flow?color=%23FF0072)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/wbkd/react-flow?color=%23FF0072)

Powerful open source libraries for building node-based UIs with React or Svelte. Ready out-of-the-box and infinitely customizable.

[React Flow](https://reactflow.dev/) · [Svelte Flow](https://svelteflow.dev/) · [React Flow Pro](https://pro.reactflow.dev)
</div>

---

## The xyflow mono repo

The xyflow repository is the home of three packages: React Flow `reactflow`, Svelte Flow `@xyflow/svelte` and a shared helper library `@xyflow/system`. The package name of React Flow will change (from `reactflow` to `@xyflow/react`) when we have a stable v12. Probably by beginning of 2024. Until then the current published package of React Flow lives on the v11 branch and is still supported of course. 

* React Flow `reactflow` version v11 is on branch v11
* Svelte Flow `@xyflow/svelte` can be found under [packages/svelte](./packages/svelte)
* React Flow v12 (not published yet) can be found under [packages/react](./packages/react)

## Key Features

- **Easy to use:** Seamless zooming and panning, single- and multi selection of graph elements and keyboard shortcuts are supported out of the box
- **Customizable:** Different node and edge types and support for custom nodes with multiple handles and custom edges
- **Fast rendering:** Only nodes that have changed are re-rendered 
- **Hooks and Utils:** hooks for handling nodes, edges and the viewport and graph util functions
- **Plugin Components:** Background, Minimap, Controls and a Panel
- **Reliable**: Written in Typescript and tested with Cypress and Playwright


## Getting Started

The best way to get started is to check out the [React Flow](https://reactflow.dev/learn) or [Svelte Flow](https://svelteflow.dev/learn) learn section. However if you want to get a sneak peek of how to install the and use the libraries you can see it here: 

<details>
  <summary><strong>React Flow</strong> basic usage</summary>

  ### Installation
  
  ```sh
npm install reactflow
  ```

  ### Basic usage
  ```jsx
import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

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
  import { writable } from 'svelte/store';
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
  } from '@xyflow/svelte';

  import '@xyflow/svelte/dist/style.css'
  
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

<SvelteFlow
  {nodes}
  {edges}
  fitView
  on:nodeclick={(event) => console.log('on node click', event)}
>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
  <MiniMap />
</SvelteFlow>
```
</details>

## Maintainers

React Flow and Svelte Flow are maintained by the team behind [xyflow](https://xyflow.com). If you need help or want to talk to us about a collaboration, reach out through our [contact form](https://xyflow.com/contact) or by joining our [Discord Server](https://discord.gg/Bqt6xrs).

- Moritz Klack • [Twitter](https://twitter.com/moklick) • [Github](https://github.com/moklick)
- Christopher Möller • [Twitter](https://twitter.com/chrtze) • [Github](https://github.com/chrtze)

Any support you provide goes directly towards the development and maintenance of React Flow and Svelte Flow, allowing us to continue to operate as an independent company, working on what we think is best for our open-source libraries.

## License

React Flow and Svelte Flow are [MIT licensed](./LICENSE).

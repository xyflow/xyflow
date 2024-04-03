![xyflow-header](https://user-images.githubusercontent.com/2857535/279643999-ffda9f91-6b6d-447d-82be-fcbd6103edb6.svg#gh-light-mode-only)
![xyflow-header-dark](https://user-images.githubusercontent.com/2857535/279644026-a01c231c-6c6e-4b41-96e0-a85c75c9acee.svg#gh-dark-mode-only)

<div align="center">

![GitHub License MIT](https://img.shields.io/github/license/wbkd/react-flow?color=%23ff0072)
![npm downloads](https://img.shields.io/npm/dt/reactflow?color=%23FF0072&label=React%20Flow%20downloads)
![npm downloads](https://img.shields.io/npm/dt/@xyflow/svelte?color=%23FF3E00&label=Svelte%20Flow%20downloads)

Powerful open source libraries for building node-based UIs with React or Svelte. Ready out-of-the-box and infinitely customizable.

[React Flow](https://reactflow.dev/) · [Svelte Flow](https://svelteflow.dev/) · [React Flow Pro](https://reactflow.dev/pro) · [Discord](https://discord.gg/Bqt6xrs)
</div>

---

## The xyflow mono repo

The xyflow repository is the home of four packages:
* React Flow 11 `reactflow` [v11 branch](https://github.com/xyflow/xyflow/tree/v11)
* React Flow 12 (beta) `@xyflow/react` [packages/react](./packages/react)
* Svelte Flow `@xyflow/svelte` [packages/svelte](./packages/svelte)
* Shared helper library `@xyflow/system` [packages/system](./packages/system)

**We just moved repositories** from the @wbkd org to this one. React Flow v11 will remain on the [v11 branch](https://github.com/xyflow/xyflow/tree/v11). When we have a stable v12, the package name of React Flow will change from `reactflow` to `@xyflow/react`.

## Commercial usage

**Are you using React Flow or Svelte Flow for a personal project?** Great! No sponsorship needed, you can support us by reporting any bugs you find, sending us screenshots of your projects, and starring us on Github 🌟

**Are you using React Flow or Svelte Flow at your organization and making money from it?** Awesome! We rely on your support to keep our libraries developed and maintained under an MIT License, just how we like it. For React Flow you can do that on the [React Flow Pro website](https://reactflow.dev/pro) and for both of our libraries you can do it through [Github Sponsors](https://github.com/sponsors/xyflow).

## Getting started

The best way to get started is to check out the [React Flow](https://reactflow.dev/learn) or [Svelte Flow](https://svelteflow.dev/learn) learn section. However if you want to get a sneak peek of how to install and use the libraries you can see it here: 

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

## The xyflow team

React Flow and Svelte Flow are maintained by the team behind [xyflow](https://xyflow.com). If you need help or want to talk to us about a collaboration, reach out through our [contact form](https://xyflow.com/contact) or by joining our [Discord Server](https://discord.gg/Bqt6xrs).

- Christopher • [Twitter](https://twitter.com/chrtze) • [Github](https://github.com/chrtze)
- Hayleigh • [Twitter](https://twitter.com/hayleighdotdev) • [Github](https://github.com/hayleigh-dot-dev)
- John • [Website](https://johnrobbdesign.com/) • [Mastodon](https://mastodon.social/@johnrobbjr)
- Moritz • [Twitter](https://twitter.com/moklick) • [Github](https://github.com/moklick)
- Peter • [Github](https://github.com/peterkogo)


## License

React Flow and Svelte Flow are [MIT licensed](./LICENSE).

![readme-header-dark](https://user-images.githubusercontent.com/3797215/156384064-08a889d6-73c0-4cbf-8ff3-28dc601d1f5f.svg#gh-dark-mode-only)
![readme-header](https://user-images.githubusercontent.com/3797215/156259138-fb9f59f8-52f2-474a-b78c-6570867e4ead.svg#gh-light-mode-only)

<div align="center">

  ![GitHub License MIT](https://img.shields.io/github/license/wbkd/react-flow?color=%23ff0072)
  ![npm downloads](https://img.shields.io/npm/dt/react-flow-renderer?color=%23FF0072&label=downloads)
  ![GitHub Repo stars](https://img.shields.io/github/stars/wbkd/react-flow?color=%23FF0072)
  ![GitHub release (latest by date)](https://img.shields.io/github/v/release/wbkd/react-flow?color=%23FF0072)

### Wire Your Ideas With React Flow!  
A highly customizable React component for building interactive graphs and node-based editors.

[🚀 Getting Started](https://reactflow.dev/docs/getting-started/installation) | [📖 Documentation](https://reactflow.dev/docs/api/react-flow-props) | [📺 Examples](https://reactflow.dev/docs/examples/overview) | [☎️ Discord](https://discord.gg/RVmnytFmGW) | [💎 React Flow Pro](https://pro.reactflow.dev/pricing)
  
</div>

----

## Key Features

- **Easy to use:** Seamless zooming and panning, single- and multi selection of graph elements and keyboard shortcuts are supported out of the box
- **Customizable:** Different [node](https://reactflow.dev/docs/api/nodes/node-types) and [edge types](https://reactflow.dev/docs/api/edges/edge-types) and support for custom nodes with multiple handles and custom edges
- **Fast rendering:** Only nodes that have changed are re-rendered and only those in the viewport are displayed
- **Hooks and Utils:** [Hooks](https://reactflow.dev/docs/api/hooks/use-react-flow) for handling nodes, edges and the viewport and graph [helper functions](https://reactflow.dev/docs/api/graph-util-functions)
- **Plugin Components:** [Background](https://reactflow.dev/docs/api/plugin-components/background), [MiniMap](https://reactflow.dev/docs/api/plugin-components/minimap) and [Controls](https://reactflow.dev/docs/api/plugin-components/controls)
- **Reliable**: Written in [Typescript](https://www.typescriptlang.org/) and tested with [cypress](https://www.cypress.io/)

## Commercial Usage / Attribution

React Flow includes a small attribution that links to the React Flow website. **We expect companies who are using React Flow commercially to subscribe to [React Flow Pro](https://pro.reactflow.dev/pricing) if they want to remove the attribution.** By subscribing you get access to other exclusive services like advanced examples, individual support or prioritized bug reports. In non-commercial applications you may hide the attribution without subscribing but are welcome to [sponsor us on Github](https://github.com/sponsors/wbkd).

You can find more information in our [React Flow Pro FAQs](https://pro.reactflow.dev/faq).

## Installation

The easiest way to get the latest version of React Flow is to install it via npm:

```bash
npm install react-flow-renderer
```

## Quick Start

This is only a very basic usage example of React Flow. To see everything that is possible with the library, please refer to the [website](https://reactflow.dev) for [guides](https://reactflow.dev/docs/guides/custom-nodes), [examples](https://reactflow.dev/docs/examples/overview) and [API reference](https://reactflow.dev/docs/api/react-flow-props).

```jsx
import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';

function Flow({ nodes, edges, onNodesChange, onEdgesChange, onConnect }) {
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
    </ReactFlow>
  );
}
```

## Development

Before you start you need to build the project using `npm run build`.  Then install the React Flow dependencies via `npm install` and the ones of the examples `cd example && npm install`.

If you want to contribute or develop custom features the easiest way is to start the dev server:

```sh
npm start
```

and the example app via:

```sh
cd example && npm start 
```

The example app serves the content of the `example` folder and watches changes inside the `src` folder. The examples are using the source of the `src` folder.

## Testing

Testing is done with cypress. You can find the tests in the [`integration/flow`](/cypress/integration/flow) folder. In order to run the tests do:

```sh
npm run test
```

## Maintainers

React Flow is developed and maintained by [webkid](https://webkid.io), a web development agency with focus on data driven applications from Berlin. If you need help or want to talk to us about a collaboration, feel free to contact us:

* Moritz Klack • [Twitter](https://twitter.com/moklick) • [Github](https://github.com/moklick)
* Christopher Möller • [Twitter](https://twitter.com/chrtze) • [Github](https://github.com/chrtze)

You can also use our [contact form](https://pro.reactflow.dev/contact) or join the [React Flow Discord Server](https://discord.gg/Bqt6xrs).

## Community Packages

* [useUndoable](https://github.com/Infinium8/useUndoable) - Hook for undo/redo functionality with an explicit React Flow example
* [react-flow-smart-edge](https://github.com/tisoap/react-flow-smart-edge) - Custom edge that doesn't intersect with nodes
* [Feliz.ReactFlow](https://github.com/tforkmann/Feliz.ReactFlow) - Feliz React Bindings for React Flow

## Credits

React Flow was initially developed for [datablocks](https://datablocks.pro), a graph-based editor for transforming, analyzing and visualizing data in your browser. Under the hood, React Flow depends on these great libraries:

* [d3-zoom](https://github.com/d3/d3-zoom) - used for zoom, pan and drag interactions with the graph canvas
* [d3-drag](https://github.com/d3/d3-drag) - used for making the nodes draggable
* [zustand](https://github.com/pmndrs/zustand) - internal state management

## License

React Flow is [MIT licensed](https://github.com/wbkd/react-flow/blob/main/LICENSE).

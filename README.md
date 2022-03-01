![readme-header-dark](https://user-images.githubusercontent.com/3797215/156258604-73ab192f-e13c-4caf-aabb-e46f5d6b26af.svg#gh-dark-mode-only)
![readme-header](https://user-images.githubusercontent.com/3797215/156259138-fb9f59f8-52f2-474a-b78c-6570867e4ead.svg#gh-light-mode-only)

<div align="center">

  ![GitHub License MIT](https://img.shields.io/github/license/wbkd/react-flow?color=%23FF0072)
  ![npm downloads](https://img.shields.io/npm/dt/react-flow-renderer?color=%23FF0072&label=downloads)
  ![GitHub Repo stars](https://img.shields.io/github/stars/wbkd/react-flow?color=%23FF0072)
  ![GitHub release (latest by date)](https://img.shields.io/github/v/release/wbkd/react-flow?color=%23FF0072)

### Wire Your Ideas With React Flow!  
A highly customizable React component for building interactive graphs and node-based editors.

[Getting Started](https://reactflow.dev/docs/getting-started/installation) | [Documentation](https://reactflow.dev/docs/api/react-flow-props) | [Examples](https://reactflow.dev/docs/examples/overview) | [Discord](https://discord.gg/Bqt6xrs)
</div>

----

## Installation

```
npm install react-flow-renderer
```

## Quick Start

This is a very basic example of how to use React Flow. You can find more advanced examples on the [website](https://reactflow.dev/examples).

```js
import React from 'react';
import ReactFlow from 'react-flow-renderer';

const elements = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  // you can also pass a React component as a label
  { id: '2', data: { label: <div>Node 2</div> }, position: { x: 100, y: 100 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

const BasicFlow = () => <ReactFlow elements={elements} />;
```

## Community Packages

* [useUndoable](https://github.com/Infinium8/useUndoable) - Hook for undo/redo functionality with an explicit React Flow example
* [react-flow-smart-edge](https://github.com/tisoap/react-flow-smart-edge) - Custom edge that doesn't intersect with nodes
* [Feliz.ReactFlow](https://github.com/tforkmann/Feliz.ReactFlow) - Feliz React Bindings for React Flow

## Development

Before you start you need to install the React Flow dependencies via `npm install` and the ones of the examples `cd example && npm install`.

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

React Flow is developed and maintained by [webkid](https://webkid.io), a data visualization studio from Berlin. It was initially developed for [datablocks](https://datablocks.pro), a graph-based editor for transforming, analyzing and visualizing data in your browser. If you need help or want to talk to us about a collaboration, feel free to contact us:

* Moritz Klack • [Twitter](https://twitter.com/moklick) • [Github](https://github.com/moklick)
* Christopher Möller • [Twitter](https://twitter.com/chrtze) • [Github](https://github.com/chrtze)

You can also use our [contact form](https://webkid.io/contact/) or join the [React Flow Discord Server](https://discord.gg/Bqt6xrs).

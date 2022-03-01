[![react-flow-dark](https://user-images.githubusercontent.com/3797215/156254036-83f8cd4e-bd20-476d-bc58-fff8b739a1dc.svg#gh-dark-mode-only)](https://reactflow.dev)
[![react-flow-light](https://user-images.githubusercontent.com/3797215/156254371-0147ce58-a59d-44d6-8279-c89f36ac4f6b.svg#gh-light-mode-only)](https://reactflow.dev)


<div align="center">

  ![GitHub License MIT](https://img.shields.io/github/license/wbkd/react-flow?color=%23FF0072)
  ![npm downloads](https://img.shields.io/npm/dt/react-flow-renderer?color=%23FF0072&label=downloads)
  ![GitHub Repo stars](https://img.shields.io/github/stars/wbkd/react-flow?color=%23FF0072)
  ![GitHub release (latest by date)](https://img.shields.io/github/v/release/wbkd/react-flow?color=%23FF0072)

**React Flow is a library for building node based graphs. You can easily implement custom node types and it comes with components like a mini map and graph controls.**

[Getting Started](https://reactflow.dev) | [Website](https://reactflow.dev) | [Documentation](https://reactflow.dev/docs) | [Examples](https://reactflow.dev/examples)
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

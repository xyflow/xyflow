[![react-flow](https://user-images.githubusercontent.com/2857535/95224198-b2540000-07fa-11eb-832d-361d72d60345.jpg)](https://reactflow.dev)

React Flow is a library for building node based graphs. You can easily implement custom node types and it comes with components like a mini map and graph controls. Feel free to check out the [examples](https://reactflow.dev/) or read the [blog post](https://webkid.io/blog/react-flow-node-based-graph-library/) to get started.

## 👉 Next Major Release 👈

We are currently working on the next version. You can find the installation instructions and breaking changes in [this PR](https://github.com/wbkd/react-flow/pull/1555). Your feedback is highly appreciated :) 

- **Website:** https://reactflow.dev
- **Documentation:** https://reactflow.dev/docs
- **Examples:** https://reactflow.dev/examples
- **Website/Docs Repository:** https://github.com/wbkd/react-flow-docs
- **Community:** https://discord.gg/Bqt6xrs
- **Sponsorship:** https://github.com/sponsors/wbkd

React Flow was initially created for [datablocks](https://datablocks.pro). A node-based editor for transforming, analyzing and visualizing data.

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

## Maintainer

Moritz Klack • [Twitter](https://twitter.com/moklick) • [Github](https://github.com/moklick)

## Support

If you need custom support or features for your application we are [happy to hear from you](https://webkid.io/contact).


### Thanks!

Special thanks to [Andy Lindemann](https://github.com/AndyLnd) for a lot of helpful contributions!

---

React Flow is maintained by [webkid](https://webkid.io), a data visualization agency from Berlin. If you need help or want to develop react-based tools or data visualizations, [get in touch](https://webkid.io/contact)!

---
title: Introduction
---

React Flow is a library for building node-based graphs. You can easily implement custom node types and it comes with components like a mini-map and graph controls. Feel free to check out the [examples](https://reactflow.dev/) or read the [blog post](https://webkid.io/blog/react-flow-node-based-graph-library/) to get started.

## Key Features

* **Easy to use:** Seamless zooming & panning behaviour and single and multi-selections of elements
* **Customizable:** Different [node](#node-types--custom-nodes) and [edge types](#edge-types--custom-edges) and support for custom nodes with multiple handles and custom edges
* **Fast rendering:** Only nodes that have changed are re-rendered and only those that are in the viewport are displayed
* **Utils:** Snap-to-grid and graph [helper functions](#helper-functions)
* **Components:** [Background, Minimap and Controls](#components)
* **Reliable**: Written in [Typescript](https://www.typescriptlang.org/) and tested with [cypress](https://www.cypress.io/)

In order to make this library as flexible as possible we don’t do any state updates besides the positions. This means that you need to pass the functions to remove an element or connect nodes by yourself. You can implement your own ones or use the helper functions that come with the library.
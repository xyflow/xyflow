---
title: Getting Started
---

Before you can start to use React Flow you need to install `react-flow-renderer`:

## Installation

**npm:**
```bash
npm install react-flow-renderer
```

**yarn:**
```bash
yarn add react-flow-renderer
```

## Usage

This is a very basic example of how to use React Flow. A flow consists of nodes and edges (or just nodes). Together we call them elements. You can pass a set of elements as a prop to the ReactFlow component. Hereby all elements need unique ids. A node needs a position and a label and an edge needs a source (node id) and a target (node id). This is the most basic for a flow. A simple flow could look like this:

```jsx
import React from 'react';
import ReactFlow from 'react-flow-renderer';

const elements = [
  {
    id: '1',
    type: 'input', // input node
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  // default node
  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output', // output node
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
  // animated edge
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

export default () => (
  <div style={{ height: 300 }}>
    <ReactFlow elements={elements} />
  </div>
);
```

import Flow from './index';

<Flow />

<InfoBox title="Attention!" text="The dimensions of your React Flow component depend on the parents dimensions."/>

## Basic Functionality

We don’t do any state updates besides the positions. This means that you need to pass the functions to remove an element or connect nodes by yourself. You can implement your own ones or use the [helper functions](/docs/api/helper-functions/) that come with the library. Here you see an example of how to use the heler functions `removeElements` and `addEdge`.


```jsx
import React, { useState } from 'react';
import ReactFlow, { removeElements, addEdge } from 'react-flow-renderer';

const initialElements = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Another Node' },
    position: { x: 100, y: 125 },
  },
];

export default () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <div style={{ height: 300 }}>
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        deleteKeyCode={46} /* 'delete'-key */
      />
    </div>
  );
}
```

In this example you can connect nodes and remove selected nodes and edges with the backspace key.

import Basic from './BasicFunctions';

<Basic />

You can find more advanced examples in the [examples](/examples/) section.

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
  // input node
  {
    id: '1',
    type: 'input',
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
  // output node
  {
    id: '3',
    type: 'output',
    // you can also pass a React component as a label
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
  // animated edge
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

const BasicFlow = () => <ReactFlow elements={elements} />;
```

import Flow from './index';

<Flow />

You can find more advanced examples in the [examples](reactflow.dev/examples/) section.

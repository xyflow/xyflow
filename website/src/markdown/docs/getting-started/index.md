---
title: Getting Started
---

Before you can start to use React Flow you need to install `react-flow-renderer` from npm:

## Installation

```bash
npm install react-flow-renderer
```

## Usage

This is a very basic example of how to use React Flow. We are rendering two nodes connected with an edge. There are more advanced examples in the [examples](/examples) section.

```jsx
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

import Flow from './index';

<Flow />
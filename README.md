# :ocean: React Flow

React library for building node-based graphs.

# Installation

```
npm install github:wbkd/react-flow
```

# Usage

This is a very basic example of how to use react-flow. There are more advanced examples in the [example](/example/src) folder.

```javascript
import React from 'react';
import Graph from 'react-flow';

const elements = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

const graphStyles = { width: '100%', height: '100%' };

const BasicGraph = () => (
  <Graph elements={elements} style={graphStyles} />
);
```

# Props

- `elements`: array with nodes and edges
- `onElementClick`: element click handler
- `onElementsRemove`: element remove handler
- `onNodeDragStop`: node drag stop handler
- `onConnect`: connect handler
- `onLoad`: editor load handler
- `onMove`: move handler
- `nodeTypes`: object with node types
- `edgeTypes`: object with node types
- `connectionLineType`: connection line type = `straight` or `bezier`
- `connectionLineStyle`: connection style as svg attributes
- `deleteKeyCode`: delete key code
- `selectionKeyCode`: selection key code
- `showBackground`: boolean
- `backgroundGap`: gap size
- `backgroundColor`: color of dots or lines
- `backgroundType`: background type = `dots` or `lines`
- `snapToGrid`: boolean
- `snapGrid`: [x, y] array

# Plugins

- Mini map
- Controls: zoom & fit view

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
- `style`: css style passed to the wrapper
- `connectionLineType`: connection line type = `straight` or `bezier`
- `connectionLineStyle`: connection style as svg attributes
- `deleteKeyCode`: default: `16`
- `selectionKeyCode`: default: `false`
- `showBackground`: default: `true`
- `backgroundGap`: gap size - default: `16`
- `backgroundColor`: color of dots or lines - default: `#eee`
- `backgroundType`: background type = `dots` or `lines` - default: `dots`
- `snapToGrid`: default: `false`
- `snapGrid`: [x, y] array - default: `[16, 16]`
- `onlyRenderVisibleNodes`: default: `true`

# Plugins

- Mini map
- Controls: zoom & fit view

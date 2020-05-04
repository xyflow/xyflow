![react-flow](https://user-images.githubusercontent.com/2857535/67417109-516ef000-f5c8-11e9-938a-c2121d3ebbe4.png)

# :ocean: React Flow

React Flow is a library for building node-based graphs. You can easily implement custom node types and it comes with  plugins like a MiniMap and a Controls Panel. Check out the [demo](https://react-flow.netlify.com/) graph.

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Nodes](#nodes)
  - [Props](#props-1)
  - [Node Types / Custom Nodes](#node-types--custom-nodes)
- [Edges](#nodes)
  - [Props](#props-2)
  - [Edge Types / Custom Edges](#edge-types--custom-edges)
- [Plugins](#plugins)
  - [Minimap](#minimap)
  - [Controls](#controls)
- [Examples](#examples)

## Installation

```
npm install react-flow-renderer
```

## Usage

This is a very basic example of how to use react-flow. There are more advanced examples in the [example](/example/src) folder.

```javascript
import React from 'react';
import Graph from 'react-flow-renderer';

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

## Props

- `elements`: array of [nodes](#nodes) and [edges](#edges) *(required)*
- `onElementClick`: element click handler
- `onElementsRemove`: element remove handler
- `onNodeDragStop`: node drag stop handler
- `onConnect`: connect handler
- `onLoad`: editor load handler
- `onMove`: move handler
- `nodeTypes`: object with [node types](#node-types--custom-nodes)
- `edgeTypes`: object with [edge types](#edge-types--custom-edges)
- `style`: css style passed to the wrapper
- `connectionLineType`: connection line type = `straight` or `bezier`
- `connectionLineStyle`: connection style as svg attributes
- `deleteKeyCode`: default: `8` (delete)
- `selectionKeyCode`: default: `16` (shift)
- `showBackground`: default: `true`
- `backgroundGap`: gap size - default: `16`
- `backgroundColor`: color of dots or lines - default: `#eee`
- `backgroundType`: background type = `dots` or `lines` - default: `dots`
- `snapToGrid`: default: `false`
- `snapGrid`: [x, y] array - default: `[16, 16]`
- `onlyRenderVisibleNodes`: default: `true`
- `isInteractive`: default: `true`. If the graph is not interactive you can't drag any nodes

## Nodes

There are three different [node types](#node-types--custom-nodes) (`default`, `input`, `output`) you can use. You can also create [custom nodes](#node-types--custom-nodes).

Node example: `{ id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } }`

### Props

- `id`: string *(required)*
- `position`: { x: number, y: number } *(required)*
- `data`: {} *(required if you are using a standard type, otherwise depends on your implementation)*
- `type`: 'input' | 'output' | 'default' or a custom one you implemented
- `style`: css properties
- `targetPosition`: 'left' | 'right' | 'top' | 'bottom' handle position - default: 'top'
- `sourcePosition`: 'left' | 'right' | 'top' | 'bottom' handle position - default: 'bottom'

### Node Types / Custom Nodes

The standard node types are `input`, `default` and `output`. The default node types object looks like this:

```javascript
{
  input: InputNode,
  default: DefaultNode,
  output: OutputNode
}
```

The keys represent the type names and the values are the node components that gets rendered.
If you want to introduce a new node type you can pass a node types object like this:

```javascript
nodeTypes={{
  special: MyCustomNode
}}
```

You can now use type `special` for a node.
The `default`, `input` and `output` types will be still available except you overwrite one of them.
You can find an example of how to implement a custom node in the [custom node example](example/src/CustomNode).


## Edges

There are three [edge types](#edge-types--custom-edges) (`straight`, `default`, `step`) you can use. The default type is `default`. You can also create [custom edges](#edge-types--custom-edges).

Edge example: `{ id: 'e1-2', type: 'straight', source: '1', target: '2', animated: true }`

### Props

- `id`: string *(required)*
- `source`: string *(required)*
- `target`: string *(required)*
- `type`: 'input' | 'output' | 'default' or a custom one you implemented
- `animated`: boolean
- `style`: css properties

### Edge Types / Custom Edges

The standard edge types are `straight`, `default` and `step`. The default edge types object looks like this:

```javascript
{
  default: BezierEdge,
  straight: StraightEdge,
  step: StepEdge
}
```

The keys represents the type name and the value is the edge component.
If you want to introduce a new edge type you can pass a edge types object like this:

```javascript
edgeTypes={{
  special: MyCustomEdge
}}
```

You can now use type `special` for an edge.
The `straight`, `default` and `step` types will be still available except you overwrite one of them.

## Plugins

### MiniMap

You can use the MiniMap plugin by passing it as a children of you graph:

```javascript
import Graph, { MiniMap } from 'react-flow';

const GraphWithMiniMap = () => (
  <Graph
    elements={elements}
  >
    <MiniMap />
  </Graph>
);
```

#### Props

- `nodeColor`: string | function - if you pass a color as a string all nodes will get that color. If you pass a function you can return a color depending on the node.
- `nodeBorderRadius`: number
- `maskColor`: string
- `style`: css properties
- `className`: class name

### Controls

The control panel contains a zoom-in, zoom-out and a fit-view button. You can use it by passing it as children to your graph:

```javascript
import Graph, { Controls } from 'react-flow';

const GraphWithControls = () => (
  <Graph
    elements={elements}
  >
    <Controls />
  </Graph>
);
```

#### Props

- `style`: css properties
- `className`: class name

## Examples

You can find all examples in the [example](example) folder or check out the live versions:

- [rich](https://react-flow.netlify.app/rich)
- [basic](https://react-flow.netlify.app/basic)
- [empty](https://react-flow.netlify.app/empty)
- [inactive](https://react-flow.netlify.app/inactive)
- [custom node](https://react-flow.netlify.app/custom-node)

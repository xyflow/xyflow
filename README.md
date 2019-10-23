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

- `elements`: array of [nodes](#nodes) and [edges](#edges) (required)
- `onElementClick`: element click handler
- `onElementsRemove`: element remove handler
- `onNodeDragStop`: node drag stop handler
- `onConnect`: connect handler
- `onLoad`: editor load handler
- `onMove`: move handler
- `nodeTypes`: object with [node types](#node-types)
- `edgeTypes`: object with [edge types](#edge-types)
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

## Nodes

There are three different [node types](#node-types) (`default`, `input`, `output`) you can use. You can also create [custom nodes](#custom-nodes).

Node example: `{ id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } }`

*Node Props*

- `id`: string (required)
- `position`: { x: number, y: number } (required)
- `data`: {} (required if you are using a standard type, otherwise depends on your implementation)
- `type`: 'input' | 'output' | 'default' or a custom one you implemented
- `style`: css properties

## Edges

There are three [edge types](#edge-types) (`straight`, `default`, `step`) you can use. The default type is `default`. You can also create [custom edges](#custom-edges).

Edge example: `{ id: 'e1-2', type: 'straight', source: '1', target: '2', animated: true }`

*Edge Props*

- `id`: string (required)
- `source`: string (required)
- `target`: string (required)
- `type`: 'input' | 'output' | 'default' or a custom one you implemented
- `animated`: boolean
- `style`: css properties

## Node Types / Custom Nodes

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
You can find an example of how to implement a custom node in [custom nodes example](example/src/CustomNodes).

# Edge Types / Custom Edges

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

# Plugins

## MiniMap

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

*Props*

- `nodeColor`: string | function - if you pass a color as a string all nodes will get that color. If you pass a function you can return a color depending on the node.
- `nodeBorderRadius`: number
- `maskColor`: string
- `style`: css properties
- `className`: class name

## Controls

The control panel contains a zoom-in, zoom-out and a fit-view button.

*Props*

- `style`: css properties
- `className`: class name

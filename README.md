 ![react-flow](https://user-images.githubusercontent.com/2857535/88070904-7e5e2c80-cb73-11ea-9f69-6b8647eef24a.png)

# React Flow

React Flow is a library for building node-based graphs. You can easily implement custom node types and it comes with components like a mini-map and graph controls. Feel free to check out the [examples](https://reactflow.dev/) or read the [blog post](https://webkid.io/blog/react-flow-node-based-graph-library/) to get started.

- [Key Features](#key-features)
- [Installation](#installation)
- [Usage](#usage)
- [ReactFlow Component Prop Types](#react-flow-component-prop-types)
- [Nodes](#nodes)
  - [Options](#options-1)
  - [Node Types & Custom Nodes](#node-types--custom-nodes)
  - [Handle Component](#handle-component)
- [Edges](#edges)
  - [Options](#options)
  - [Edge Types & Custom Edges](#edge-types--custom-edges)
  - [Edge Utils](#edge-utils)
- [Components](#components)
  - [Background](#background)
  - [Minimap](#minimap)
  - [Controls](#controls)
  - [ReactFlowProvider](#reactflowprovider)
- [Styling](#styling)
- [Helper Functions](#helper-functions)
- [Access Internal State and Actions](#access-internal-state-and-actions)
- [Examples](#examples)
- [Development](#development)
- [Testing](#testing)

## Key Features

* **Easy to use:** Seamless zooming & panning behaviour and single and multi-selections of elements
* **Customizable:** Different [node](#node-types--custom-nodes) and [edge types](#edge-types--custom-edges) and support for custom nodes with multiple handles and edges
* **Fast rendering:** Only nodes that have changed are re-rendered and only those that are in the viewport are displayed
* **Utils:** Snap-to-grid, background styles and graph [helper functions](#helper-functions)
* **Components:** [Background, Minimap and graph controls](#components)
* **Reliable**: Written in [Typescript](https://www.typescriptlang.org/) and tested with [cypress](https://www.cypress.io/)

In order to make this library as flexible as possible we don’t do any state updates besides the positions. This means that you need to pass the functions to remove an element or connect nodes by yourself. You can implement your own ones or use the helper functions that come with the library.

# Installation

```
npm install react-flow-renderer
```

# Usage

This is a very basic example of how to use React Flow. There are more advanced examples in the [example](/example/src) folder.

```javascript
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

# React Flow Component Prop Types

#### Basic Props
- `elements`: array of [nodes](#nodes) and [edges](#edges) *(required)*
- `style`: css properties
- `className`: additional class name

#### Flow View
- `minZoom`: default: `0.5`
- `maxZoom`: default: `2`
- `defaultZoom`: default: `1`
- `defaultPosition`: default: `[0, 0]`
- `snapToGrid`: default: `false`
- `snapGrid`: [x, y] array - default: `[16, 16]`
- `onlyRenderVisibleNodes`: default: `true`

#### Event Handlers
- `onElementClick(event: MouseEvent, element: Node | Edge)`: called when user clicks node or edge click
- `onElementsRemove(elements: Elements)`: called when user removes node or edge
- `onNodeDragStart(event: MouseEvent, node: Node)`: node drag start
- `onNodeDragStop(event: MouseEvent, node: Node)`: node drag stop
- `onNodeMouseEnter(event: MouseEvent, node: Node)`: node mouse enter
- `onNodeMouseMove(event: MouseEvent, node: Node)`: node mouse move
- `onNodeMouseLeave(event: MouseEvent, node: Node)`: node mouse leave
- `onNodeContextMenu(event: MouseEvent, node: Node)`: node context menu
- `onConnect({ source, target })`: called when user connects two nodes
- `onConnectStart(event: MouseEvent, { nodeId, handleType })`: called when user starts to drag connection line
- `onConnectStop(event: MouseEvent)`: called when user stops to drag connection line
- `onConnectEnd(event: MouseEvent)`: called after user stops or connects nodes
- `onLoad(reactFlowInstance)`: called after flow is initialized
- `onMove()`: called when user is panning or zooming
- `onMoveStart()`: called when user starts panning or zooming
- `onMoveEnd()`: called when user ends panning or zooming
- `onSelectionChange(elements: Elements)`: called when user selects one or multiple elements
- `onSelectionDragStart(evt: MouseEvent, nodes: Node[])`: called when user starts to drag a selection
- `onSelectionDrag(evt: MouseEvent, nodes: Node[])`: called when user drags a selection
- `onSelectionDragStop(evt: MouseEvent, nodes: Node[])`: called when user stops to drag a selection
- `onPaneClick(event: MouseEvent)`: called when user clicks directly on the canvas
- `onPaneContextMenu(event: MouseEvent)`: called when user does a right-click on the canvas
- `onPaneScroll(event: WheelEvent)`: called when user scrolls pane (only works when `zoomOnScroll` is set to `false) 

#### Interaction
- `nodesDraggable`: default: `true`. This applies to all nodes. You can also change the behavior of a specific node with the `draggable` node option.
- `nodesConnectable`: default: `true`. This applies to all nodes. You can also change the behavior of a specific node with the `connectable` node option.
- `elementsSelectable`: default: `true`. This applies to all elements. You can also change the behavior of a specific node with the `selectable` node option.
- `zoomOnScroll`: default: `true`
- `zoomOnDoubleClick`: default: `true`
- `selectNodesOnDrag`: default: `true`
- `paneMoveable`: default: `true` - If set to `false`, panning and zooming is disabled

#### Element Customization
- `nodeTypes`: object with [node types](#node-types--custom-nodes)
- `edgeTypes`: object with [edge types](#edge-types--custom-edges)
- `arrowHeadColor`: default: `#bbb`

#### Connection Line Options
- `connectionLineType`: connection line type = `default` (bezier), `straight`, `step`, `smoothstep`
- `connectionLineStyle`: connection style as svg attributes

#### Keys
- `deleteKeyCode`: default: `8` (delete)
- `selectionKeyCode`: default: `16` (shift)

## React Flow Instance

You can receive a `reactFlowInstance` by using the `onLoad` callback:

```javascript
import React from 'react';
import ReactFlow from 'react-flow-renderer';

const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
}

const BasicFlow = () => <ReactFlow onLoad={onLoad} elements={[]} />;
```

`reactFlowInstance` has the following functions:

### project

Transforms pixel coordinates to the internal React Flow coordinate system

`project = (position: XYPosition): XYPosition`

### fitView

Fits view port so that all nodes are visible

`fitView = ({ padding }): void`

### zoomIn

`zoomIn = (): void`

### zoomOut

`zoomOut = (): void`

### zoomTo

`zoomTo = (zoomLevel: number): void`

### getElements

`getElements = (): Elements`

### setTransform

Sets position and zoom of the pane

`setTransform = (transform: FlowTransform): void`

# Nodes

There are three different [node types](#node-types--custom-nodes) (`default`, `input`, `output`) you can use. The node types differ in the number and types of handles. An input node has only a source handle, a default node has a source and a target and an output node has only a target handle. You create nodes by adding them to the `elements` array of the `ReactFlow` component.

Node example: `{ id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } }`

## Options

- `id`: string *(required)*
- `position`: { x: number, y: number } *(required)*
- `data`: {} *(required if you are using a standard type, otherwise depends on your implementation)*
- `type`: 'input' | 'output' | 'default' or a custom one you implemented
- `style`: css properties
- `className`: additional class name
- `targetPosition`: 'left' | 'right' | 'top' | 'bottom' handle position - default: 'top'
- `sourcePosition`: 'left' | 'right' | 'top' | 'bottom' handle position - default: 'bottom'
- `isHidden`: if `true`, the node will not be rendered
- `draggable`: boolean - if option is not set, the node is draggable (overwrites generel `nodesDraggable` option)
- `connectable`: boolean - if option is not set, the node is connectable (overwrites generel `nodesConnectable` option)
- `selectable`: boolean - if option is not set, the node is selectable (overwrites generel `elementsSelectable` option)

## Node Types & Custom Nodes

The standard node types are `input`, `default` and `output`. The default node types object looks like this:

```javascript
{
  input: InputNode,
  default: DefaultNode,
  output: OutputNode
}
```

The keys represent the type names and the values are the components that get rendered.
If you want to introduce a new type you can pass a `nodeTypes` object to the `ReactFlow` component:

```javascript
nodeTypes={{
  special: MyCustomNode
}}
```

You can now use the type `special` for a node.
The `default`, `input` and `output` types would be still available except you overwrote one of them.
There is an example of a custom node implementation in the [custom node example](/example/src/CustomNode).

## Custom Node Props

Your custom nodes are wrapped so that the basic functions like dragging or selecting work. Custom nodes receive the following props:

- `id`: string
- `data`: object
- `type`: string
- `selected`: boolean
- `sourcePosition`: string
- `targetPosition`: string

### Prevent dragging

If you have controls inside your custom node that should not drag the node you can add the class name `nodrag`.

## Handle Component

We export a `Handle` component as a helper for your custom nodes:

```javascript
import { Handle } from 'react-flow-renderer';

const targetHandleWithValidation = (
  <Handle
    type="target"
    position="left"
    isValidConnection={(connection) => connection.source === 'some-id'}
    onConnect={params => console.log('handle onConnect', params)}
    style={{ background: '#fff' }}
  />
);
```

### Prop Types

- `type`: 'source' or 'target'
- `id`: string - you only need this when you have multiple source or target handles (otherwise the node id is used)
- `position`: 'left', 'right', 'top' or 'bottom' handle position - default: 'top' for type target, 'bottom' for type source
- `onConnect`: function that gets triggered on connect
- `isValidConnection`: function receives a connection `{ target: 'some-id', source: 'another-id' }` as param, returns a boolean - default: `true`
- `style`: css properties
- `className`: additional class name

### Validation

The handle receives the additional class names `connecting` when the connection line is above the handle and `valid` if the connection is valid. You can find an example which uses these classes [here](/example/src/Validation/index.js).

### Multiple Handles

If you need multiple source or target handles you can achieve this by creating a custom node. Normally you just use the id of a node for the `source` or `target` of an edge. If you have multiple source or target handles you need to pass an id to these handles. These ids get then added to the node id, so that you can connect a specific handle. If you have a node with an id = `1` and a handle with an id = `a` you can connect this handle by using the id = `1__a`.
You can find an example of how to implement a custom node with multiple handles in the [custom node example](/example/src/CustomNode/ColorSelectorNode.js#L18-L29).

# Edges

React Flow comes with four [edge types](#edge-types--custom-edges) (`default`, `straight`, `step`, `smoothstep`). As the names indicate, the edges differ in the representation. The default type is a bezier edge. You create edges by adding them to your `elements` array of the `ReactFlow` component.

Edge example: `{ id: 'e1-2', type: 'straight', source: '1', target: '2', animated: true, label: 'edge label' }`

If you wanted to display this edge, you would need a node with id = 1 (source node) and another one with id = 2 (target node).

## Options

- `id`: string *(required)*
- `source`: string (an id of a node) *(required)*
- `target`: string (an id of a node) *(required)*
- `type`: 'default' (bezier), 'straight', 'step' and 'smoothedge' or a custom one depending on your implementation
- `animated`: boolean
- `style`: css properties for the edge line path
- `className`: additional class name
- `label`: string
- `labelStyle`: css properties for the text
- `labelShowBg`: boolean - default: `true`
- `labelBgStyle`: css properties for the text background
- `labelBgPadding`: [number, number] background rectangle padding - default: `[2, 4]`
- `labelBgBorderRadius`: number - default 2
- `arrowHeadType`: 'arrow' or 'arrowclosed' - defines the arrowhead of the edge
- `markerEndId`: custom marker end url - if this is used `arrowHeadType` gets ignored
- `isHidden`: if `true`, the edge will not be rendered
- `data`: {} you can use this to pass data to your custom edges.

You can find an example with different edges in the [edges example](https://reactflow.dev/edges).

## Edge Types & Custom Edges

The basic edge types are `default` (bezier), `straight`, `step` and `smoothstep`. The default `edgeTypes` object looks like this:

```javascript
{
  default: BezierEdge,
  straight: StraightEdge,
  step: StepEdge,
  smoothstep: SmoothStepEdge
}
```

The keys represent the type names and the values are the edge components.
If you want to introduce a new edge type you can pass an `edgeTypes` object to the `ReactFlow` component:

```javascript
edgeTypes={{
  special: MyCustomEdge
}}
```

Now you could use the new type `special` for an edge.
The `straight`, `default` and `step` types would still be available unless you overwrote one of them.
There is an implementation of a custom edge in the [edges example](/example/src/Edges/index.js).

## Edge Utils

There are several utils that help you to create a custom edge. They are used in the [custom edge](/example/src/Edges/CustomEdge.js) example.

### getBezierPath

Returns the path of a bezier edge.

`getBezierPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
}: GetBezierPathParams): string`

### getSmoothStepPath

Returns the path of a smooth step edge. You can set `borderRadius` = `0` to get a step edge path.

`getSmoothStepPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  borderRadius = 5,
}: GetSmoothStepPathParams): string`

### getEdgeCenter

Returns the center poostion `[centerX, centerY]` of the edge.

`getEdgeCenter({ sourceX, sourceY, targetX, targetY }: GetCenterParams): [number, number, number, number]`

### getMarkerEnd

Returns the marker end url for displaying the arrow head.

`getMarkerEnd(arrowHeadType?: ArrowHeadType, markerEndId?: string): string`

# Components

## Background

React Flow comes with two background variants: **dots** and **lines**. You can use it by passing it as a children to the `ReactFlow` component:

```javascript
import ReactFlow, { Background } from 'react-flow-renderer';

const FlowWithBackground = () => (
  <ReactFlow elements={elements}>
    <Background
      variant="dots"
      gap={12}
      size={4}
    />
  </ReactFlow>
);
```

### Prop Types

- `variant`: string - has to be 'dots' or 'lines' - default: `dots`
- `gap`: number - the gap between the dots or lines - default: `16`
- `size`: number - the radius of the dots or the stroke width of the lines - default: `0.5`
- `color`: string - the color of the dots or lines - default: `#999` for dots, `#eee` for lines
- `style`: css properties
- `className`: additional class name

## MiniMap

You can use the mini map plugin by passing it as a children to the `ReactFlow` component:

```javascript
import ReactFlow, { MiniMap } from 'react-flow-renderer';

const FlowWithMiniMap = () => (
  <ReactFlow elements={elements}>
    <MiniMap
      nodeColor={(node) => {
        switch (node.type) {
          case 'input': return 'red';
          case 'default': return '#00ff00';
          case 'output': return 'rgb(0,0,255)';
          default: return '#eee';
        }
      }}
    />
  </ReactFlow>
);
```

### Prop Types

- `nodeColor`: string or function - If you pass a color as a string all nodes will get that color. If you pass a function you can return a color depending on the passed node.
- `nodeBorderRadius`: number
- `nodeClassName`: string or function for adding an additional class to the nodes inside the mini map
- `maskColor`: string
- `style`: css properties
- `className`: additional class name

## Controls

The control panel contains a zoom-in, zoom-out, fit-view and a lock/unlock button. You can use it by passing it as a children to the `ReactFlow` component:

```javascript
import ReactFlow, { Controls } from 'react-flow-renderer';

const FlowWithControls = () => (
  <ReactFlow elements={elements}>
    <Controls />
  </ReactFlow>
);
```

### Prop Types

- `showZoom`: boolean - default: true
- `showFitView`: boolean - default: true
- `showInteractive`: boolean - default: true
- `style`: css properties
- `className`: additional class name

## ReactFlowProvider

If you need access to the internal state and action of React Flow outside of the `ReactFlow` component you can wrap it with the `ReactFlowProvider` component:

```javascript
import ReactFlow, { ReactFlowProvider } from 'react-flow-renderer';

const FlowWithOwnProvider = () => (
  <ReactFlowProvider>
    <ReactFlow
      elements={elements}
      onElementClick={onElementClick}
      onConnect={onConnect}
    />
  </ReactFlowProvider>
);
```

It is used in the [provider example](example/src/Provider/index.js).

# Styling

There are two ways how you can style the graph pane and the elements.
You can create your own CSS rules or pass style properties to the components.

## Using Class Names

Since we are rendering DOM nodes you can simply overwrite the styles with your own CSS rules.
The React Flow wrapper has the className `react-flow`. If you want to change the graph background for example you can do:

```css
.react-flow {
  background: red;
}
```

### Used Class Names

* `.react-flow` - Outer container
* `.react-flow__renderer` - Inner container
* `.react-flow__zoompane` - Zoom & pan pane
* `.react-flow__selectionpane` - Selection pane
* `.react-flow__selection` - User selection
* `.react-flow__edges` - Edges wrapper
* `.react-flow__edge` - Edge element
  * `.selected` is added when edge is selected
  * `.animated` is added when edge is animated
* `.react-flow__edge-path` - Edge element path
* `.react-flow__edge-text` - Edge text
* `.react-flow__edge-textbg` - Edge text background
* `.react-flow__connection` - Connection line
* `.react-flow__connection-path` - Connection line path
* `.react-flow__nodes` - Nodes wrapper
* `.react-flow__node` - Node element
  * `.selected` is added when edge is selected
  * `-${type}` is added (`.react-flow__node-default`, `.react-flow__node-input`, `.react-flow__node-output`)
* `.react-flow__nodesselection` - Nodes selection
* `.react-flow__nodesselection-rect ` - Nodes selection rect
* `.react-flow__handle` - Handle component
  * `.react-flow__handle-bottom` is added when position = 'bottom'
  * `.react-flow__handle-top` is added when position = 'top'
  * `.react-flow__handle-left` is added when position = 'left'
  * `.react-flow__handle-right` is added when position = 'right'
  * `.react-flow__handle-connecting` is added when connection line is above a handle
  * `.react-flow__handle-valid` is added when connection line is above a handle and the connection is valid
* `.react-flow__background` - Background component
* `.react-flow__minimap` - Mini map component
* `.react-flow__controls` - Controls component

## Using Properties

You could achieve the same effect by passing a style prop to the `ReactFlow` component:

```javascript
const FlowWithRedBg = (
  <ReactFlow
    elements={elements}
    style={{ background: 'red', width: '100%' height: '300px' }}
  />
);
```

# Helper Functions

If you want to remove a node or connect two nodes with each other you need to pass a function to `onElementsRemove` and `onConnect`. In order to simplify this process there are some helper functions you can use:

```javascript
import ReactFlow, { isNode, isEdge, removeElements, addEdge } from 'react-flow-renderer';
```

### isEdge

Returns true if element is an edge

`isEdge = (element: Node | Edge): element is Edge`

### isNode

Returns true if element is a node

`isNode = (element: Node | Edge): element is Node`

### removeElements

Returns an array of elements without the ones from `elementsToRemove`. It also removes all incoming/outgoing edges if you just pass one or multiple nodes

`removeElements = (elementsToRemove: Elements, elements: Elements): Elements`

### addEdge

Returns elements array with added edge

`addEdge = (edgeParams: Edge, elements: Elements): Elements`

### getOutgoers

Returns all direct child nodes of the passed node

`getOutgoers = (node: Node, elements: Elements): Node[]`

### getConnectedEdges

Returns all edges that are connected to the passed nodes

`getConnectedEdges = (nodes: Node[], edges: Edge[]): Edge[]`

You can use these function as seen in [this example](/example/src/Overview/index.js#L40-L41) or use your own ones.

# Access Internal State and Actions

Under the hood React Flow uses [Easy Peasy](https://easy-peasy.now.sh/) for state handling.
If you need to access the internal state you can use the `useStoreState` hook inside a child component of the `ReactFlow` component:

```javascript
import ReactFlow, { useStoreState } from 'react-flow-renderer';

const NodesDebugger = () => {
  const nodes = useStoreState(state => state.nodes);

  console.log(nodes);

  return null;
}

const Flow = () => (
  <ReactFlow elements={elements}>
    <NodesDebugger />
  </ReactFlow>
);
```

You will not need this in most cases but you can also use the internal actions that are defined in the [store](/src/store/index.ts):

```javascript
import React, { useEffect } from 'react';
import { useStoreActions } from 'react-flow-renderer'

const TransformUpdater = ({ x, y, zoom }) => {
  const setTransform = useStoreActions(actions => actions.setInitTransform);

  useEffect(() => {
    setTransform({ x, y, k: zoom })
  }, [x, y, zoom])
});
```

If you need more control you can wrap the `ReactFlow` component with the `ReactFlowProvider` component in order to be able to call `useStoreState` and `useStoreActions` outside of the `ReactFlow` component.

# Examples

You can find all examples in the [example](example) folder or check out the live versions:

- [overview](https://reactflow.dev/)
- [basic](https://reactflow.dev/basic)
- [custom node](https://reactflow.dev/custom-node)
- [horizontal](https://reactflow.dev/horizontal)
- [stress](https://reactflow.dev/stress)
- [validation](https://reactflow.dev/validation)
- [provider](https://reactflow.dev/provider)
- [edges](https://reactflow.dev/edges)
- [empty](https://reactflow.dev/empty)
- [interaction](https://reactflow.dev/interaction)
- [provider](https://reactflow.dev/provider)
- [hidden](https://reactflow.dev/hidden)
- [edge types](https://reactflow.dev/edge-types)

# Development

You need to install the React Flow dependencies via `npm install` and the ones of the examples `cd example && npm install`.

If you want to contribute or develop some custom features the easiest way is to start the dev server:

```
npm run dev
```

This serves the content of the `example` folder and watches changes inside the `src` folder. The examples are using the source of the `src` folder.

# Testing

Testing is done with cypress. You can find all tests in the [`integration/flow`](/cypress/integration/flow) folder. In order to run the tests do:

```
npm run test
```

## Thanks!

Special thanks to [Andy Lindemann](https://github.com/AndyLnd) for a lot of helpful contributions!

---

React Flow was initially developed by [webkid](https://webkid.io), a data visualization company from Berlin. If you need help or want to develop react-based tools or data visualizations, get in touch!

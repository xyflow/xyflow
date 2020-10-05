---
id: nodes
title: Nodes
---

There are three different [node types](#node-types--custom-nodes) (`default`, `input`, `output`) you can use. The node types differ in the number and types of handles. An input node has only a source handle, a default node has a source and a target and an output node has only a target handle. You create nodes by adding them to the `elements` array of the `ReactFlow` component.

Node example:

```js
{
  id: '1',
  type: 'input',
  data: { label: 'Node 1' },
  position: { x: 250, y: 5 }
}
```

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
- `draggable`: boolean - if option is not set, the node is draggable (overwrites general `nodesDraggable` option)
- `connectable`: boolean - if option is not set, the node is connectable (overwrites general `nodesConnectable` option)
- `selectable`: boolean - if option is not set, the node is selectable (overwrites general `elementsSelectable` option)

## Node Types & Custom Nodes

The standard node types are `input`, `default` and `output`. The default node types object looks like this:

```js
{
  input: InputNode,
  default: DefaultNode,
  output: OutputNode
}
```

The keys represent the type names and the values are the components that get rendered.
If you want to introduce a new type you can pass a `nodeTypes` object to the `ReactFlow` component:

```js
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

If you have controls or other elements inside your custom node that should not drag the node you can add the class name `nodrag`.

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
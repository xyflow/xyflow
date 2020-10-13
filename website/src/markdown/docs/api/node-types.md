---
title: Node Types & Custom Nodes
---

There are three different node types (`default`, `input`, `output`) you can use. The node types differ in the number and types of handles. An input node has only a source handle, a default node has a source and a target and an output node has only a target handle. The default node types object looks like this:

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
There is an example of a custom node implementation in the [custom node example](/examples/custom-node).

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

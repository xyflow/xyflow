---
title: Helper Functions
---

If you want to remove a node or connect two nodes with each other you need to pass a function to `onElementsRemove` and `onConnect`. In order to simplify this process there are some helper functions you can use:

```javascript
import ReactFlow, { isNode, isEdge, removeElements, addEdge } from 'react-flow-renderer';
```

### `isEdge`

Returns `true` if the passed element is an edge.

`isEdge = (element: Node | Edge): element is Edge`

### `isNode`

Returns `true` if the passed element is a node.

`isNode = (element: Node | Edge): element is Node`

### `removeElements`

Returns an array of elements without the ones from `elementsToRemove`. It also removes all incoming/outgoing edges if you just pass one or multiple nodes.

`removeElements = (elementsToRemove: Elements, elements: Elements): Elements`

### `addEdge`

Returns an array with elements with the added edge.

`addEdge = (edgeParams: Edge, elements: Elements): Elements`

### `getOutgoers`

Returns all direct child nodes of the passed node.

`getOutgoers = (node: Node, elements: Elements): Node[]`

### `getIncomers`

Returns all direct incoming nodes of the passed node.

`getIncomers = (node: Node, elements: Elements): Node[]`

### `getConnectedEdges`

Returns all edges that are connected to the passed nodes.

`getConnectedEdges = (nodes: Node[], edges: Edge[]): Edge[]`

You can use these function as seen in [this example](https://github.com/wbkd/react-flow/blob/main/example/src/Overview/index.js#L119-L120) or use your own ones.

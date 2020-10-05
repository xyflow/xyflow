---
title: Instance
---

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

### `project`

Transforms pixel coordinates to the internal ReactFlow coordinate system.
This can be used when you drag nodes (from a side bar for example) and need the position on the pane.

`project = (position: XYPosition): XYPosition`

### `fitView`

Fits view port so that all nodes are inside the view port.

`fitView = ({ padding }): void`

### `zoomIn`

`zoomIn = (): void`

### `zoomOut`

`zoomOut = (): void`

### `zoomTo`

`zoomTo = (zoomLevel: number): void`

### `getElements`

`getElements = (): Elements`

### `setTransform`

Sets position and zoom of the pane.

`setTransform = (transform: FlowTransform): void`
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

The `reactFlowInstance` has the following functions:

### `project`

Transforms pixel coordinates to the internal ReactFlow coordinate system.
This can be used when you drag nodes (from a side bar for example) and need the internal position on the pane.

`project = (position: XYPosition): XYPosition`

**example:**
```
reactFlowInstance.project({ x: 100, y: 100 });
```

### `fitView`

Fits the view port so that all nodes are visible

`fitView = ({ padding }): void`

### `zoomIn`

Zoom in

`zoomIn = (): void`

### `zoomOut`

Zoom out

`zoomOut = (): void`

### `zoomTo`

Zooms to the specified zoom level

`zoomTo = (zoomLevel: number): void`

### `getElements`

`getElements = (): Elements`

### `setTransform`

Sets position and zoom of the pane.

`setTransform = (transform: FlowTransform): void`

**example:**
```
reactFlowInstance.setTransform({ x: 100, y: 100, zoom: 1.5 });
```
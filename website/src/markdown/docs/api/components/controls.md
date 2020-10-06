---
title: Controls
---

The control panel contains a zoom-in, zoom-out, fit-view and a lock/unlock button. You can use it by passing it as a children to the `ReactFlow` component:

### Usage

```jsx
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

**Typescript:** The interface of the Controls Prop Types are exported as `ControlProps`.
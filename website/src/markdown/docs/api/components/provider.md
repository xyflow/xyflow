---
title: Provider
---

If you need access to the internal state and action of React Flow outside of the `ReactFlow` component you can wrap it with the `ReactFlowProvider` component:

```jsx
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

It is used in the [provider example](/examples/provider/).
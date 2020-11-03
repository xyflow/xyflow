---
title: Handle Component
---

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
- `onConnect`: function that gets triggered on connect. This callback only gets executed on source handles.
- `isValidConnection`: function receives a connection `{ target: 'some-id', source: 'another-id', sourceHandle: 'source handle id or null', targetHandle: 'target handle id or null' }` as param, returns a boolean - default: `true`.
- `style`: css properties
- `className`: additional class name

**Typescript:** The interface of the Handle Prop Types are exported as `HandleProps`.

### Validation

The handle receives the additional class names `connecting` when the connection line is above the handle and `valid` if the connection is valid. You can find an example which uses these classes [here](/examples/validation/).

### Multiple Handles

If you need multiple source or target handles you can achieve this by creating a custom node. Normally you just use the id of a node for the `source` or `target` of an edge. If you have multiple source or target handles you need to pass an id to these handles. These ids can be used by an edge with the `sourceHandle` and `targetHandle` options, so that you can connect a specific handle. If you have a node with an id = `1` and a handle with an id = `a` you can connect this handle by using the node `source=1` and the `sourceHandle=__a`.

You can find an example of how to implement a custom node with multiple handles in the [custom node example](https://github.com/wbkd/react-flow/blob/main/example/src/CustomNode/ColorSelectorNode.js#L18-L29).

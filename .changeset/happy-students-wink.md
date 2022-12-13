---
'@reactflow/core': patch
'@reactflow/minimap': patch
'@reactflow/node-toolbar': patch
'reactflow': patch
---

Add `getNodes` function to the store so that you don't need to do `Array.from(store.getState().nodeInternals.values())` anymore.
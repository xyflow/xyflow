---
"@xyflow/vue": major
---

Remove the deprecated `updateEdge` util (use `reconnectEdge`) and `useZoomPanHelper` (use the viewport functions on `useVueFlow()`). `addEdge` now takes an edges array instead of mixed elements: `addEdge(connection, edges)`.

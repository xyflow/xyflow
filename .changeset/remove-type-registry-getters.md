---
"@xyflow/vue": major
---

Removed `getNodeTypes` and `getEdgeTypes` from `useVueFlow()`. Node and edge components now resolve from the registered types directly; read `nodeTypes`/`edgeTypes` off `useStore()` if you need the registered map.

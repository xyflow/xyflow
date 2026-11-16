---
"@xyflow/vue": major
---

`isValidConnection` now receives only the attempted connection, matching `IsValidConnection` in React and Svelte Flow. The extra second argument (`{ nodes, edges, sourceNode, targetNode }`) is removed, read those from `useVueFlow()` inside your handler if you need them.

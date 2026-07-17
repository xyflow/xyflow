---
"@xyflow/vue": minor
---

`isValidConnection` now receives only the attempted connection, matching React/Svelte Flow's `IsValidConnection`. The extra second argument (`{ nodes, edges, sourceNode, targetNode }`) is removed, read those from `useVueFlow()` inside your handler if you need them.

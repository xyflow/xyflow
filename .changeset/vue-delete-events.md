---
"@xyflow/vue": minor
---

Add `nodesDelete`, `edgesDelete`, and `delete` events, matching `@xyflow/react` (`onNodesDelete`/`onEdgesDelete`/`onDelete`) and `@xyflow/svelte` (`ondelete`). They fire from `deleteElements` (the choke point for both the delete key and programmatic deletion) after `onBeforeDelete` has resolved the removed set — `edgesDelete` with the removed edges, `nodesDelete` with the removed nodes (each only when non-empty), and `delete` with `{ nodes, edges }` whenever anything was removed. Also exports the `OnDelete` handler type alongside `OnBeforeDelete`.

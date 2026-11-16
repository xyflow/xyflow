---
"@xyflow/vue": minor
---

Add the `onBeforeDelete` prop and the `deleteElements` action. `deleteElements({ nodes, edges })` also removes child nodes and connected edges, and resolves to `{ deletedNodes, deletedEdges }`. `onBeforeDelete` runs before the Delete key and `deleteElements` remove anything: return `false` to cancel, `true` to continue or `{ nodes, edges }` to delete a subset.

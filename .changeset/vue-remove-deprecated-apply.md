---
"@xyflow/vue": major
---

Remove the deprecated array-based `applyChanges`, `applyNodeChanges` and `applyEdgeChanges` exports. Use the changeset's `applyTo(elements)`, or `useVueFlow()`'s `applyNodeChanges`/`applyEdgeChanges` which take a changeset and write to the store.

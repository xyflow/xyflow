---
"@xyflow/vue": major
---

Remove the array-based `applyChanges`, `applyNodeChanges` and `applyEdgeChanges` exports, and `applyNodeChanges`/`applyEdgeChanges` on the `useVueFlow()` instance. Use `applyTo(elements)` of the changeset instead.

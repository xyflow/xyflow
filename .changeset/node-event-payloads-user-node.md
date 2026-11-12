---
"@xyflow/vue": major
---

Node event payloads now carry the user `Node` instead of the enriched `InternalNode` (xyflow/react + svelte parity).

`nodeClick`/`nodeMouseEnter`/`nodeMouseMove`/`nodeMouseLeave`/`nodeContextMenu`/`nodeDoubleClick`, `nodeDragStart`/`nodeDrag`/`nodeDragStop`, `selectionDragStart`/`selectionDrag`/`selectionDragStop`, `selectionContextMenu`, the minimap node events, and `nodesInitialized` all emit user `Node`s now.

If a handler read store-computed fields off the event node (`node.internals.positionAbsolute`, `node.internals.z`, `node.internals.handleBounds`, authoritative `node.measured`), resolve the enriched node from the id instead:

```ts
onNodeDrag(({ node }) => {
  const internal = getInternalNode(node.id) // or useInternalNode(() => node.id)
  // internal.internals.positionAbsolute, internal.measured, …
})
```

`nodesInitialized` is also now typed with a payload (`NodeType[]`) on the component emit, matching the hook.

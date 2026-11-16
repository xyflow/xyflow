---
"@xyflow/vue": major
---

Split nodes into the user-facing `Node` and the `InternalNode` (formerly `GraphNode`), matching `@xyflow/react` and `@xyflow/svelte`. `v-model:nodes`, `getNodes`, `getNode` and `getSelectedNodes` return the plain nodes you passed in. Read `internals` (absolute position, z-index, handle bounds) and `measured` via `getInternalNode(id)`, `useInternalNode(id)` or `nodeLookup`.

- In-place node mutation (`node.position = …`, `node.data.x = …`) is no longer reactive. Use `updateNode`, `updateNodeData` or `setNodes`.
- Nodes are no longer filled with defaults: a node without `data` keeps `data: undefined` (previously `{}`), and `selected`/`dragging` stay `undefined` until set.

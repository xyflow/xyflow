---
"@xyflow/vue": patch
---

`EdgeWrapper` now computes edge positions with `getEdgePosition` from `@xyflow/system` (as `@xyflow/react` and `@xyflow/svelte` do) instead of a hand-rolled copy. It returns `null` when a node is not initialized or a handle cannot be resolved, so an edge between nodes that render no `<Handle>` draws nothing instead of a phantom line to the bounding box of the node. This also aligns handle resolution across connection modes with the other packages.

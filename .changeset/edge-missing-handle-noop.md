---
"@xyflow/vue": patch
---

`EdgeWrapper` now computes edge positions with `@xyflow/system`'s `getEdgePosition` (as `@xyflow/react` and `@xyflow/svelte` do) instead of a hand-rolled copy. It returns `null` when a node isn't initialized or a handle can't be resolved, so an edge between nodes that render no `<Handle>` draws nothing instead of a phantom line to the node's bounding box. This also aligns handle resolution across connection modes with the other packages.

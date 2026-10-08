---
"@xyflow/vue": minor
---

`MiniMapNodeFunc` may now return `undefined` — its signature is `(node) => string | undefined` — so a per-node callback can fall back to the themed default for that node. An `undefined` `nodeColor`, `nodeStrokeColor` or `nodeClassName` no longer throws.

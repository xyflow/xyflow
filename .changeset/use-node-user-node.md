---
"@xyflow/vue": minor
---

`useNode` now returns the user-facing `Node` instead of the enriched `InternalNode` — use `useInternalNode` for `internals`/`measured`. Its `id` argument also accepts a ref or getter, matching `useInternalNode`.

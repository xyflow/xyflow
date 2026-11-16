---
"@xyflow/vue": minor
---

Tightened the edge `label` type. Dropped the catch-all `object` from `EdgeProps` and `EdgeTextProps` so it matches the actual label type of edges (`string | VNode | Component`).

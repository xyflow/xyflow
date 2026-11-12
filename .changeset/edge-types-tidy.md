---
"@xyflow/vue": minor
---

Tightened the edge `label` type. Dropped the catch-all `object` from `EdgeProps` and `EdgeTextProps` so it matches the edge's actual label type (`string | VNode | Component`).

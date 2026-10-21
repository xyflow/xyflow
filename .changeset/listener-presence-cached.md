---
"@xyflow/vue": patch
---

Keep listener presence out of the per-frame computeds in the node and edge wrappers, so a drag stops walking the reactive hooks once per element per frame.

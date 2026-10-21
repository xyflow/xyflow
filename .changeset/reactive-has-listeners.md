---
"@xyflow/vue": patch
---

Make `hasListeners()` reactive. It read a plain `Set`, so nothing tracked it and consumers only stayed current by being recomputed for unrelated reasons.

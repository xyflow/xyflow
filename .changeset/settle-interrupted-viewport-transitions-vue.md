---
"@xyflow/vue": patch
---

Resolve the promises of animated viewport functions like `fitView` and `setCenter` with `false` when a user interaction or another viewport change interrupts the animation, instead of leaving them pending

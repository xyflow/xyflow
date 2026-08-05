---
"@xyflow/vue": minor
---

`fitView()` now waits for the nodes to be committed and measured before fitting, so it frames the current graph even when called right after `addNodes()` or a reposition. You no longer need a `nextTick()` before `fitView()`. It returns a promise you can await, but awaiting is optional.

---
"@xyflow/vue": patch
---

Create a node's drag instance in a post-flush effect. The pre-flush default queued one scheduler job per node on every commit, which Vue's scheduler rescans on each parent-driven child update.

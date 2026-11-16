---
"@xyflow/vue": minor
---

Add a `stepPosition` option to smooth-step / step edges. Set `pathOptions.stepPosition` (0 = bend at source, 1 = at target, 0.5 = midpoint, the default) to control where the edge bends along its path. The path math comes from `getSmoothStepPath` from `@xyflow/system`; the `SmoothStepEdge` component now forwards the option to it.

---
"@xyflow/vue": minor
---

Add `width` and `height` props to `<VueFlow>`. They tell the flow what size to assume until it has been measured, which lets the initial `fitView` be computed during server side rendering. `defaultViewport` now seeds the initial transform too.

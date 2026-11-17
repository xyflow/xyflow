---
"@xyflow/vue": patch
---

Render nodes during server-side rendering. The node renderer waited for a `ResizeObserver` that only exists in the browser, so server-rendered markup contained edges but no nodes.

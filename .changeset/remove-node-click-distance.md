---
"@xyflow/react": major
"@xyflow/svelte": major
"@xyflow/vue": major
"@xyflow/system": major
---

Remove `nodeClickDistance`. Whether a click on a node fires is now determined solely by whether a drag actually moved the node: clicks are suppressed only after a drag changed node positions. Use `nodeDragThreshold` (and `snapGrid`) to control this.

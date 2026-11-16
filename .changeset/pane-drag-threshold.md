---
"@xyflow/react": major
"@xyflow/svelte": major
"@xyflow/vue": major
"@xyflow/system": major
---

Replace `paneClickDistance` with `paneDragThreshold` (default `1`). Like `nodeDragThreshold`, the pane only starts panning or selecting once the pointer has moved further than the threshold; otherwise it counts as a click. Works with every mouse button.

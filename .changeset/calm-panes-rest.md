---
'@xyflow/svelte': patch
---

Stop re-registering the pane's wheel listener on every pan and zoom step, which made the browser repaint all nodes each frame

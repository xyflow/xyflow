---
'@xyflow/react': patch
'@xyflow/svelte': patch
---

Fix node intersection helpers so root nodes respect the flow's `nodeOrigin` while child nodes avoid applying their origin twice after conversion to absolute coordinates.

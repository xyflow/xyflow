---
'@xyflow/react': patch
'@xyflow/svelte': patch
'@xyflow/vue': patch
---

Keep a node's drag behaviour bound across updates. Rebuilding it on every update cancelled a touch drag that was already running, because d3 keeps the listeners for a touch gesture on the element itself.

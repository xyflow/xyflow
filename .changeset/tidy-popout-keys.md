---
'@xyflow/react': patch
---

Fix keyboard shortcuts in popout windows by listening on the flow's own document and window. Reset `useKeyPress` state and listeners when its target changes.

---
'@xyflow/react': patch
---

Only create an `XYDrag` instance for draggable nodes. A non-draggable node no longer allocates one on mount, so static and read-only graphs pay nothing for drag setup (the saving scales with the number of non-draggable nodes). Draggable nodes are unaffected.

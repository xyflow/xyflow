---
'@xyflow/react': patch
'@xyflow/svelte': patch
---

Fix selection box appearing when dragging the pane via touch. Prefer touch panning over drag selection when `selectionOnDrag` is combined with mouse-button-specific `panOnDrag` settings.

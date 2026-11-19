---
"@xyflow/system": patch
---

Fix the connection line using the wrong handle in `ConnectionMode.Loose` when a node has a source and a target handle with the same id (or both without an id, like the built-in default node). A connection dragged from the target handle started at the source handle, and hovering the target handle snapped the line to the source handle.

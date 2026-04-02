---
'@xyflow/react': minor
'@xyflow/svelte': minor
'@xyflow/system': minor
---

Add `autoPanOnSelection` (default `true`) so the viewport can auto-pan when you drag a selection rectangle near the pane edges, similar to edge auto-pan while dragging nodes.

Keep the selection rectangle anchored in flow coordinates while the viewport moves so the box stays aligned with the graph during auto-pan.

Set `autoPanOnSelection={false}` to restore the previous behavior (no auto-pan during selection).

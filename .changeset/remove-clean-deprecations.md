---
"@xyflow/vue": major
---

Remove long-deprecated APIs (2.0). Each has a drop-in replacement:

- **`FlowExportObject.position` / `FlowExportObject.zoom` removed** — `toObject()` no longer emits them; use `FlowExportObject.viewport` (`{ x, y, zoom }`) instead.
- **`GraphEdge.events` removed** — this legacy per-edge handler bag was vestigial (never read); edge events are emitted through the store (`useVueFlow().onEdgeClick`, etc.).

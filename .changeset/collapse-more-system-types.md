---
"@xyflow/vue": patch
---

Reuse more `@xyflow/system` types instead of re-defining them locally: `XYPosition`, `Dimensions`, `Rect`, `SnapGrid`, `SelectionRect`, `SelectionMode`, `Position`, `ConnectionMode`, `Connection`, `NodeConnection`, `HandleType`, `NodeDimensionChange`, `NodePositionChange`, `NodeSelectionChange`, `NodeRemoveChange`, `EdgeSelectionChange`, `EdgeRemoveChange` and `Align`. Public API is unchanged (they're re-exported from the entry).

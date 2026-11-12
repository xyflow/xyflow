---
"@xyflow/vue": patch
---

Keep the current selection on a pane click when `elementsSelectable` is `false`. Previously a pane click always cleared the selection; now a selection set before selection was disabled, or set programmatically, survives the click. The interactive reset is centralized in a new gated `resetSelectedElements` action (a no-op while `elementsSelectable` is `false`), distinct from `removeSelectedNodes`/`removeSelectedEdges`, which still clear unconditionally.

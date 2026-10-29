---
"@xyflow/vue": patch
---

Clear the visual nodes-selection box when no selected nodes remain. `nodesSelectionActive` only ever turns on via a user drag-select, but it could get stuck `true` after the selected nodes were removed (e.g. deleted) — so a later programmatic select would wrongly render the `NodesSelection` rect around an unrelated node. Re-adopting nodes now turns it back off whenever the selection is empty. 

---
"@xyflow/vue": patch
---

A plain click on the pane no longer opens a selection box or fires `selectionStart`/`selectionEnd`. The selection (clearing the current selection + `selectionStart`) now begins only once the pointer moves past the click threshold (`paneClickDistance`, or immediately while the selection key is held), and `nodesSelectionActive` / `selectionEnd` only update when a real selection drag happened — instead of resetting on every pointer-down and activating on every pointer-up.

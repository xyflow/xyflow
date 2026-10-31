---
"@xyflow/system": patch
---

Ignore `ResizeObserver` entries without a `contentRect` in the zoom pane extent cache, so test setups that mock `ResizeObserver` (like the one in the testing guide) no longer crash

---
'@xyflow/react': patch
---

Stop the `<MiniMap />` from re-rendering on every store update. Its selector builds new `viewBB`/`boundingRect` objects on each call, so the default `shallow` equality always treated them as changed and the minimap re-rendered on unrelated changes such as node selection. It now compares those rects by value, so it only re-renders when its geometry actually changes.

---
"@xyflow/vue": patch
---

Fix `panActivationKeyCode` having no effect when it is a modifier such as `Control`. The pressed state was never passed to `XYPanZoom`, whose filter drops a `ctrlKey`-modified pointerdown unless it is told the pan key is down.

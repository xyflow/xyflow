---
'@xyflow/react': patch
---

Fix `useKeyPress` not detecting repeated key combinations while a modifier is held down, so shortcuts like `Meta+z` keep firing without releasing `Meta` in between.

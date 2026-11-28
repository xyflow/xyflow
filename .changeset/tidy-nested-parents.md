---
'@xyflow/react': patch
'@xyflow/system': patch
---

Fix nested `expandParent` dragging so opted-in ancestors grow to enclose their children. Preserve sibling positions, nonzero node origins, and the dragged node's position when releasing or reversing a drag.

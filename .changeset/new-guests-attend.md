---
'@reactflow/core': patch
---

Check if prevClosestHandle exists in onPointerUp. Fixes connections getting stuck on last handle and connecting, even when out of connectionRadius

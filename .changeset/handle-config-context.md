---
'@xyflow/react': patch
---

Provide the shared handle config (`connectOnClick`, `noPanClassName`, `rfId`) through context instead of subscribing to the store in every `Handle`, so a store update no longer runs a selector once per handle

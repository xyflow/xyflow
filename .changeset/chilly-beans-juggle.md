---
'@xyflow/system': patch
---

Fix node drag threshold behavior across different zoom levels. The drag threshold calculation now uses client coordinates instead of transformed coordinates, ensuring consistent behavior regardless of zoom level.

---
"@xyflow/system": patch
---

Fix `fitView` with `includeHiddenNodes` ignoring hidden nodes that declare an intrinsic size (`width`/`height`/`initialWidth`/`initialHeight`) but were never measured

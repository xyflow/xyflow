---
"@xyflow/system": patch
---

Fix a child node with `extent: 'parent'` not being clamped to its parent when the parent declares an intrinsic size (`width`/`initialWidth`) but hasn't been measured yet. `calculateNodePosition` now uses the same `getNodeDimensions` fallback as `clampPositionToParent`.

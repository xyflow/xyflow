---
"@xyflow/react": patch
---

Fix `<Background />` pattern offset being miscalculated due to an errant `|| 1` fallback in the offset math, causing dots/lines to be misaligned by more than expected (off by 1px with the default `offset={0}`, and by up to half the gap size for non-zero `offset` values).

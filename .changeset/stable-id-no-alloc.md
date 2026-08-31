---
"@xyflow/vue": patch
---

Drop the per-frame id-array allocation in `NodeRenderer`/`EdgeRenderer`. The stable id-list computed previously mapped the whole `nodes`/`edges` array to ids on every commit just to diff it against the previous list. It now compares the live array against the previous id list in place with an indexed loop, allocating a new id array only when membership actually changes — the unchanged path (every drag frame) allocates nothing.

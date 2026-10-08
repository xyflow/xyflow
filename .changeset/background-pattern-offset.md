---
"@xyflow/vue": patch
---

Correct `<Background>`'s pattern offset, which was computed as `offset * zoom || 1 + gap / 2`. That parses as `offset * zoom || (1 + gap / 2)`, so with the default `offset` of `0` the pattern sat one pixel off. It is now `offset * zoom + dimensions / 2`.

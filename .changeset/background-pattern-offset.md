---
"@xyflow/vue": patch
---

Correct the pattern offset of `<Background>`, which was calculated as `offset * zoom || 1 + gap / 2`.
That parses as `offset * zoom || (1 + gap / 2)`, so with the default `offset` of `0` the pattern sat one pixel off.

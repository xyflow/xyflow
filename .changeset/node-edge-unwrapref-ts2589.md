---
"@xyflow/vue": patch
---

Fix the intermittent `TS2589: Type instantiation is excessively deep` error on updates like `nodes.value = nodes.value.map(...)`. Nodes and edges are now excluded from the Vue `UnwrapRef`.

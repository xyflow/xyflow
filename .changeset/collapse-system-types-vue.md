---
"@xyflow/vue": patch
---

`EdgeToolbarProps` and `NodeOrigin` are now derived from `@xyflow/system` instead of being redeclared locally. Both were structurally identical, so neither type's shape changes.

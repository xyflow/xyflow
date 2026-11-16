---
"@xyflow/vue": major
---

Custom connection lines (`#connection-line` slot) receive `from*`/`to*` props instead of `source*`/`target*` (`sourceX` → `fromX`, `targetHandle` → `toHandle`, …), matching `@xyflow/react`. `markerStart`/`markerEnd` are optional.

The `ElementData` type is removed. `Edge` data now defaults to `Record<string, unknown>`.

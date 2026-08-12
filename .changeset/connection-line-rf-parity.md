---
"@xyflow/vue": major
---

Align the connection-line component props with xyflow/react (and the existing `ConnectionState`): `ConnectionLineProps` now uses `from*`/`to*` naming instead of `source*`/`target*`.

- `sourceX`/`sourceY`/`sourcePosition` → `fromX`/`fromY`/`fromPosition`; `targetX`/`targetY`/`targetPosition` → `toX`/`toY`/`toPosition`
- `sourceNode`/`sourceHandle` → `fromNode`/`fromHandle`; `targetNode`/`targetHandle` → `toNode`/`toHandle`
- `markerStart`/`markerEnd` are now optional, matching `EdgeProps` (a required `string` made a custom connection line's `defineProps` warn "Expected String, got Undefined")

**Breaking:** custom connection-line components (the `#connection-line` slot) must read the `from*`/`to*` props.

Also removes the `ElementData` type (it was `= any`): an `Edge`'s `Data` now defaults to `Record<string, unknown>`, matching `Node` and xyflow.

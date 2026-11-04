---
"@xyflow/vue": major
---

Collapse `ConnectionLineType` and `PanelPositionType` onto their `@xyflow/system` counterparts. Both are now re-exported from `@xyflow/system` (the local definitions are removed), aligning `@xyflow/vue` with `@xyflow/react`/`@xyflow/svelte`. Two breaking changes:

- **`ConnectionLineType.SimpleBezier`'s value changed from `'simple-bezier'` to `'simplebezier'`**, matching `@xyflow/system` and vue-flow's own `'simplebezier'` edge-type registry key. If you pass the enum (`{ type: ConnectionLineType.SimpleBezier }`) nothing changes; only the raw string literal `'simple-bezier'` is affected — update it to `'simplebezier'`.
- **`PanelPositionType` is renamed to `PanelPosition`** (`@xyflow/system`'s type). It now also accepts `'center-left'` and `'center-right'` in addition to the six existing corner/edge positions. Update type references from `PanelPositionType` to `PanelPosition`.

Also trims the redundant `| MarkerType` from `EdgeMarkerType` (now `string | EdgeMarker`, matching the system shape) — non-breaking, since `MarkerType` values are already strings.

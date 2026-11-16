---
"@xyflow/vue": major
---

`ConnectionLineType` and `PanelPosition` are now re-exported from `@xyflow/system`, matching `@xyflow/react` and `@xyflow/svelte`.

- `ConnectionLineType.SimpleBezier`'s value changed from `'simple-bezier'` to `'simplebezier'`. Using the enum is unaffected; update raw `'simple-bezier'` strings.
- The `PanelPosition` enum and the `PanelPositionType` union are replaced by the `PanelPosition` string union (e.g. `'top-left'`). It also accepts `'center-left'` and `'center-right'`.

---
"@xyflow/vue": major
---

`ConnectionLineType` and `PanelPosition` are now re-exported from `@xyflow/system`, matching `@xyflow/react` and `@xyflow/svelte`.

- The value of `ConnectionLineType.SimpleBezier` changed from `"simple-bezier"` to `"simplebezier"`. Using the enum is unaffected; update raw `"simple-bezier"` strings.
- The `PanelPosition` enum and the `PanelPositionType` union are replaced by the `PanelPosition` string union (e.g. `"top-left"`). It also accepts `"center-left"` and `"center-right"`.

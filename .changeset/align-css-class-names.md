---
"@xyflow/vue": major
---

Align Vue Flow's internal DOM and structural element class names with `@xyflow/react`/`@xyflow/svelte`. The container layers now nest and are named identically to xyflow: `renderer` (outer pan/zoom container) › `pane` (drag/selection surface) › `viewport` (the transformed layer that carries the zoom transform).

Three `vue-flow__*` class suffixes change (the `vue-flow__` prefix is unchanged):

- `.vue-flow__transformationpane` → `.vue-flow__viewport` (the transformed layer)
- `.vue-flow__viewport` → `.vue-flow__renderer` (the outer container)
- `.vue-flow__edge-labels` → `.vue-flow__edgelabel-renderer`

If you target any of these in custom CSS — or query them from JS — update the selector. Note `viewport` now refers to the transformed inner layer (previously it was the outer container).

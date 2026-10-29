---
"@xyflow/vue": minor
---

Add `ease` and `interpolate` options to every viewport function. `fitView`, `setViewport`, `setCenter`, `fitBounds`, `zoomTo`, `zoomIn` and `zoomOut` now accept `ease?: (t: number) => number` and `interpolate?: 'smooth' | 'linear'` alongside `duration` to control the transition curve.

While aligning, the viewport option types now reuse `@xyflow/system` directly (breaking):

- `FitViewParams` → `FitViewOptions` (= system's `FitViewOptionsBase`). Its `nodes` option takes node objects instead of ids — `nodes?: string[]` → `nodes?: (Node | { id: string })[]` — and the vestigial `offset` option is removed (superseded by `padding`).
- `TransitionOptions` → `ViewportHelperFunctionOptions`.
- `ViewportPositionFunc` → `Project`.

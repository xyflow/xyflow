---
"@xyflow/vue": major
---

Align the initial-fit and node-origin props with `xyflow/react` + `xyflow/svelte`.

- **`fitViewOnInit` → `fitView`.** The prop that fits the view on the first render is now named `fitView` (boolean), matching react/svelte. A companion `fitViewOptions` prop forwards the initial fit's options (`padding`, `minZoom`, `maxZoom`, `duration`, `nodes`, `includeHiddenNodes`). The internal one-shot flag keeps its own name, so the `fitView()` action is unaffected.
- **`nodeOrigin` is now forwarded.** The prop existed on the type but was ignored — absolute-position computation, expand-parent, and the resize control all hard-coded `[0, 0]`. They now honor the configured `nodeOrigin` (default `[0, 0]`, unchanged).
- **`nodeClickDistance` added.** Distance (px) the pointer may move between pointerdown and pointerup on a node and still count as a click (default `0`), matching react/svelte. Previously node-drag click suppression incorrectly reused `nodeDragThreshold` for this.

| Old | New |
|---|---|
| `:fit-view-on-init="true"` | `:fit-view="true"` |
| (initial fit options were not configurable) | `:fit-view-options="{ padding: 0.2 }"` |

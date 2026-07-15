---
"@xyflow/vue": minor
---

The `nodes`/`edges` binding now determines how changes are handled, and the `autoApplyChanges` prop is removed.

- `v-model:nodes` / `v-model:edges` (or no binding at all, when driving the flow through `useVueFlow()`/`setupVueFlow()`) is **managed**: Vue Flow applies changes to its store and mirrors them back to your ref.
- A bare one-way `:nodes` / `:edges` is **controlled**: changes are delivered via `@nodes-change` / `@edges-change` and nothing is applied until you handle them (apply them and reassign your array).

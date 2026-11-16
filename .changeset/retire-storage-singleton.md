---
"@xyflow/vue": major
---

Remove the global flow registry. `useVueFlow()` no longer accepts an id or options. It returns the store of the nearest `<VueFlow>` or `<VueFlowProvider>` and throws outside of one.

- `useVueFlow({ nodes, edges, … })` → pass these as props to `<VueFlow>`.
- `useVueFlow("my-id")` to access a flow from outside → wrap both in `<VueFlowProvider>` and call `useVueFlow()` inside it.

The `id` prop is now only used as a label (aria/debug), not to look up a flow.

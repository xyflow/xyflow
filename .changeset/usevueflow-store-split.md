---
"@xyflow/vue": major
---

Split the store API. `useVueFlow()` now returns the flow **instance** (actions, computed getters and event hooks like `onNodeClick` or `onConnect`) and no longer exposes the raw reactive state. The state moved to `useVueFlowStore()`, with `storeToRefs()` to destructure it (Pinia-style).

```ts
// before
const { nodes, transform, nodeLookup, setViewport, onConnect } = useVueFlow()

// after
const { setViewport, onConnect } = useVueFlow()
const store = useVueFlowStore()                  // reactive state (store.nodes, store.transform — no .value)
const { nodes, transform } = storeToRefs(store)  // refs for destructuring
const { nodeLookup } = useVueFlowStore()         // lookup Maps can be destructured directly
```

- **`useVueFlowStore()`** returns the reactive state object, including the `nodeLookup`/`parentLookup`/`edgeLookup`/`connectionLookup` Maps. Reading it inside a `computed`, `watch` or template is tracked.
- **`storeToRefs(store)`** turns the state fields into refs so destructuring stays reactive.
- Computed getters (`getNodes`, `getEdges`, `getSelectedNodes`, `getSelectedEdges`, `viewport`) and all event hooks stay on `useVueFlow()`.

A `<VueFlow>` template ref now exposes the instance (`VueFlowInstance`). The `VueFlowStore` type is kept as an alias of `VueFlowInstance`.

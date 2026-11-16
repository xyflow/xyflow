---
"@xyflow/vue": major
---

Split the store API. `useVueFlow()` is now the curated **instance** — actions, computed getters, and event hooks (`onNodeClick`, `onConnect`, …) — and no longer exposes the raw reactive state. The state moved to a new `useStore()`, with `storeToRefs()` as the destructure bridge (Pinia-style).

```ts
// before — everything came off useVueFlow()
const { nodes, transform, nodeLookup, setViewport, onConnect } = useVueFlow()

// after
const { setViewport, onConnect } = useVueFlow()              // instance: actions + getters + hooks
const store = useStore()                                     // reactive state object (store.nodes, store.transform — no .value)
const { nodes, transform } = storeToRefs(store)              // refs for destructuring scalar/array state
const { nodeLookup } = useStore()                            // reactive-Map lookups destructure directly (no .value)
```

- **`useVueFlowStore()`** returns the reactive state object (all `State` fields + the `nodeLookup`/`parentLookup`/`edgeLookup`/`connectionLookup` Maps). Read it directly (`store.nodes`, `store.transform`) — reading inside a `computed`/`watch`/template tracks reactively, like `xyflow/svelte`'s store.
- **`storeToRefs(store)`** projects the value-type state fields to refs so `const { nodes } = storeToRefs(useStore())` stays reactive (destructuring the reactive object directly would not). The reference-type lookups stay reactive when destructured straight off `useVueFlowStore()`.
- Computed getters (`getNodes`, `getEdges`, `getSelectedNodes`, `getSelectedEdges`, `viewport`) and all event hooks remain on `useVueFlow()`.

### Migration

| Before (`useVueFlow()`)                                     | After                                                       |
|-------------------------------------------------------------|-------------------------------------------------------------|
| `const { nodes } = useVueFlow()`                            | `const { nodes } = storeToRefs(useVueFlowStore())`                 |
| `const { transform, dimensions } = useVueFlow()`            | `const { transform, dimensions } = storeToRefs(useVueFlowStore())` |
| `const { nodeLookup } = useVueFlow()`                       | `const { nodeLookup } = useVueFlowStore()`                         |
| `const { setViewport, getNodes, onConnect } = useVueFlow()` | unchanged (instance members stay)                           |

A `<VueFlow>` template ref (`defineExpose`) now exposes the instance (`VueFlowInstance`). The `VueFlowStore` type is kept as an alias of `VueFlowInstance`.

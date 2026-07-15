---
"@xyflow/vue": major
---

Retire the global flow store registry in favour of a pure context model, mirroring `useReactFlow` / `useSvelteFlow`. The store is created once by `<VueFlow>` (or `<VueFlowProvider>`) and handed to descendants via `inject`; there is no longer a module-level `Map` of flows keyed by id, nor the internal `Storage` singleton that used to live on `app.config.globalProperties.$vueFlowStorage`.

**BREAKING:** `useVueFlow()` no longer accepts any argument — no id, no options. It is a pure consumer that returns the store provided by the nearest `<VueFlow>` / `<VueFlowProvider>` ancestor, and throws a `VueFlowError` when called outside one.

Migration:

- `useVueFlow({ nodes, edges, ... })` → pass those to the component instead: `<VueFlow :nodes="nodes" :edges="edges" ... />`.
- `useVueFlow('my-id')` / `useVueFlow({ id: 'my-id' })` to reach a flow's store from outside its subtree → wrap the relevant subtree in `<VueFlowProvider>` and call `useVueFlow()` from any descendant (siblings of `<VueFlow>` included).
- Multiple independent flows on one page → give each its own `<VueFlowProvider>` (or `<VueFlow>`) tree; they no longer share a registry, so they can't collide and don't need distinct ids to stay separate.

The store `id` is still readable (`useVueFlow().id`) and can be pinned via `<VueFlowProvider id="...">` / `<VueFlow id="...">`, but it is now purely a label (aria/debug) — never a lookup key.

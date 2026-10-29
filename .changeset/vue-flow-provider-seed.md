---
"@xyflow/vue": minor
---

`<VueFlowProvider>` now accepts the same options as `setupVueFlow()` to seed its store — pass `nodes`, `edges`, or any other `VueFlowProps` and they become the store's initial values. The seed is read once when the store is created.

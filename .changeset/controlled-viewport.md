---
"@xyflow/vue": minor
---

Add a controlled `viewport` prop with `v-model:viewport` support, matching `xyflow/react`'s controlled viewport and `xyflow/svelte`'s `bind:viewport`.

```vue
<VueFlow v-model:viewport="viewport" />
```

The bound value two-way binds to the flow's canonical transform: setting it pans/zooms the flow (applied via the panzoom's `syncViewport`, so no extra pan/zoom events fire), and it updates as the user interacts (via `update:viewport`). `defaultViewport` remains the uncontrolled initial-viewport prop; use `viewport` when you want to own the viewport state.

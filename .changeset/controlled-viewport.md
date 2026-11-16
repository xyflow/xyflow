---
"@xyflow/vue": minor
---

Add a controlled `viewport` prop with `v-model:viewport` support, matching the controlled viewport of `@xyflow/react` and `bind:viewport` of `@xyflow/svelte`.

```vue
<VueFlow v-model:viewport="viewport" />
```

The bound value two-way binds to the viewport of the flow: setting it pans/zooms the flow (applied via `syncViewport`, so no extra pan/zoom events fire), and it updates as the user interacts (via `update:viewport`). `defaultViewport` remains the uncontrolled initial-viewport prop; use `viewport` when you want to own the viewport state.

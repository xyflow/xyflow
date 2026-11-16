---
"@xyflow/vue": major
---

Raise the `vue` and `@vue/reactivity` peer range to `^3.5.27`. Earlier 3.5 releases cannot resolve `@xyflow/system`'s types from a `defineProps` type argument (vuejs/core#14236, fixed in 3.5.27).

**BREAKING:** Vue `>=3.5.0` is now required (`useId()` landed in 3.5). Consumers on Vue 3.3/3.4 must upgrade. Passing an explicit `id` to `<VueFlow>` / `<VueFlowProvider>` is unaffected.

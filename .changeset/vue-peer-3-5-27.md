---
"@xyflow/vue": major
---

Raise the `vue` and `@vue/reactivity` peer range to `^3.5.27`. Earlier 3.5 releases cannot resolve `@xyflow/system`'s types from a `defineProps` type argument (vuejs/core#14236, fixed in 3.5.27).

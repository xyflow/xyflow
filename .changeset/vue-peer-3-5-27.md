---
"@xyflow/vue": major
---

Require Vue `^3.5.27` (peer dependency of `vue` and `@vue/reactivity`). The default flow `id` is now generated with `useId()`, and earlier 3.5 releases cannot resolve `@xyflow/system` types in `defineProps` (vuejs/core#14236).

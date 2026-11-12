---
"@xyflow/vue": major
---

Raise the `vue` peer dependency to `^3.5.0` (was `^3.3.0`) and generate the default flow `id` with Vue's SSR-safe [`useId()`](https://vuejs.org/api/composition-api-helpers.html#useid) instead of a module-level counter. The flow id is only an aria/debug label (not a lookup key), and `useId()` yields ids that are stable across server render and client hydration, fixing potential SSR hydration mismatches on auto-generated ids.

**BREAKING:** Vue `>=3.5.0` is now required (`useId()` landed in 3.5). Consumers on Vue 3.3/3.4 must upgrade. Passing an explicit `id` to `<VueFlow>` / `<VueFlowProvider>` is unaffected.

---
"@xyflow/vue": major
---

`nodeLookup`, `parentLookup` and `edgeLookup` are now reactive `Map`s instead of `ComputedRef`s. Read them from `useVueFlowStore()` without `.value`:

```diff
- useVueFlow().nodeLookup.value.get(id)
+ useVueFlowStore().nodeLookup.get(id)
```

---
"@xyflow/vue": major
---

Make `nodeLookup` / `parentLookup` / `edgeLookup` the maintained, reactive `Map` structures the store mutates directly, instead of Vue `computed`s derived from the node/edge arrays.

**Breaking:** these three are no longer `ComputedRef`s — they are reactive `Map`s. Read them without `.value`:

```diff
- store.nodeLookup.value.get(id)
+ store.nodeLookup.get(id)
- store.parentLookup.value
+ store.parentLookup
- store.edgeLookup.value.get(id)
+ store.edgeLookup
```

Internally, every node/edge membership mutation (`setNodes`, `setEdges`, `addNodes`, `removeNodes`, `applyNodeChanges`, `applyEdgeChanges`, `updateNode`, `updateEdge`, `$reset`) now flows through internal `commitNodes` / `commitEdges` helpers that update the lookups + `parentLookup` and keep the `nodes`/`edges` arrays as in-sync mirrors in one pass. The user-facing `nodes`/`edges` arrays remain canonical and are unchanged in shape. This is groundwork for driving node positions/handle-bounds through `@xyflow/system` directly.

---
"@xyflow/vue": patch
---

Improve the return type of `useNodesData`. It now uses `DistributivePick` from `@xyflow/system` instead of a merged object type, so when you pass a union node type the result is a discriminated union — checking `.type` narrows `.data`:

```ts
const node = useNodesData<MyNode>(id) // MyNode = TextNode | NumberNode
if (node.value?.type === "text") {
  node.value.data.text // narrowed to TextNode data
}
```

For a single (non-union) node type the result is unchanged.

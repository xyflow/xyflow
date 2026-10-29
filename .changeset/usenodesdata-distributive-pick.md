---
"@xyflow/vue": patch
---

Improve `useNodesData`'s return type. It now uses `@xyflow/system`'s `DistributivePick` instead of a merged object type, so when you pass a union node type the result is a discriminated union — checking `.type` narrows `.data`:

```ts
const node = useNodesData<MyNode>(id) // MyNode = TextNode | NumberNode
if (node.value?.type === 'text') {
  node.value.data.text // narrowed to TextNode's data
}
```

For a single (non-union) node type the result is unchanged.

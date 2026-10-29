---
"@xyflow/vue": major
---

Remove `useVueFlow().fromObject()` and the `FlowImportObject` type.

`toObject()` is unchanged. To restore a saved flow, set the elements and viewport yourself from `onInit` (or any time after mount):

```ts
const { setNodes, setEdges, setViewport, onInit } = useVueFlow()

onInit(() => {
  const flow = JSON.parse(localStorage.getItem('flow') ?? 'null')
  if (!flow) {
    return
  }

  setNodes(flow.nodes)
  setEdges(flow.edges)

  if (flow.viewport) {
    setViewport(flow.viewport)
  }
})
```

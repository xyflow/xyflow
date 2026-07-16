---
"@xyflow/vue": major
---

Removed the `autoConnect` prop and the `Connector` type. Handle new connections with `@connect` (or `onConnect`) and `addEdge`/`addEdges` instead:

```vue
<VueFlow @connect="(connection) => (edges = addEdge(connection, edges))" />
```

---
"@xyflow/vue": major
---

Remove the deprecated `useHandleConnections` composable. Use `useNodeConnections` instead: `type` → `handleType`, `id` → `handleId` and `nodeId` → `id`.

```ts
// before
useHandleConnections({ type: "target", id: "a", nodeId: "1" })
// after
useNodeConnections({ handleType: "target", handleId: "a", id: "1" })
```

---
"@xyflow/system": major
"@xyflow/react": major
"@xyflow/svelte": major
"@xyflow/vue": major
---

Align the connection APIs across all frameworks on `NodeConnection`.

- **`getHandleConnections` removed**: use `getNodeConnections({ nodeId, type, handleId })` (`id` → `handleId`, `type` is now optional). Svelte (`useSvelteFlow`) and Vue (`useVueFlow`) now provide `getNodeConnections` as well. 
- **`HandleConnection` type removed**: use `NodeConnection` instead

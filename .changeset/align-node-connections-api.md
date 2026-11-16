---
"@xyflow/system": major
"@xyflow/react": major
"@xyflow/svelte": major
"@xyflow/vue": major
---

Align the connection APIs across all frameworks on `NodeConnection`.

- Remove `getHandleConnections`. Use `getNodeConnections({ nodeId, type, handleId })` instead: `id` is renamed to `handleId` and `type` is optional.
- Add `getNodeConnections` to `useSvelteFlow`.
- `HandleConnection` type removed: use `NodeConnection` instead.

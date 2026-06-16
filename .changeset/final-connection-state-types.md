---
'@xyflow/system': patch
'@xyflow/react': patch
'@xyflow/svelte': patch
---

Fix `FinalConnectionState` type so it preserves the discriminated union. Previously `Omit` was applied to the `ConnectionState` union, collapsing both arms and making every field nullable. It now distributes over the union, so fields like `fromHandle`, `from` and `fromNode` keep their non-null types in the connection-in-progress case and can be narrowed correctly.

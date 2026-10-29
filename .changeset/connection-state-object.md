---
"@xyflow/vue": minor
---

The store now exposes the ongoing connection as a single `connection` object (`ConnectionState`), replacing the separate `connectionStartHandle`, `connectionEndHandle`, `connectionPosition`, and `connectionStatus` fields. Read `connection.fromHandle`, `connection.toHandle`, `connection.pointer`, and `connection.isValid` instead — this matches `useConnection()` and React/Svelte Flow.

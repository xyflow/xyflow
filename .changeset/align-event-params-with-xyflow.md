---
"@xyflow/vue": major
---

Align connection and reconnect event payloads with `@xyflow/react` and add a `selectionChange` event.

- `connectEnd` / `clickConnectEnd` emit `{ event, connectionState }` instead of the bare event.
- `reconnectStart` emits `{ event, edge, handleType }` and `reconnectEnd` emits `{ event, edge, handleType, connectionState }`.
- New `selectionChange` event (`@selection-change` / `onSelectionChange`) emits `{ nodes, edges }` when the selection changes.

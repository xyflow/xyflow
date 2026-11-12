---
"@xyflow/vue": major
---

Align connection/reconnect event payloads with xyflow/react and add the `selectionChange` event:

- `connectEnd` / `clickConnectEnd` now emit `{ event, connectionState }` (was the bare `MouseEvent | TouchEvent | undefined`). The `connectionState` is the `FinalConnectionState` (re-exported from `@xyflow/system`) — whether the connection was valid plus the from/to handles and nodes — mirroring react's `onConnectEnd`.
- `reconnectStart` now emits `{ event, edge, handleType }` and `reconnectEnd` now emits `{ event, edge, handleType, connectionState }` (both were `{ event, edge }`). `handleType` is the handle being reconnected; `reconnectEnd` also carries the `FinalConnectionState`, matching react's `onReconnectStart`/`onReconnectEnd`.
- Added a `selectionChange` event (`onSelectionChange` / `@selection-change`), emitting `{ nodes, edges }` whenever the set of selected nodes or edges changes — mirroring react's `onSelectionChange`. Previously selection was only observable through `nodesChange`/`edgesChange` select changes.

Handlers that only read `edge` (reconnect) or ignore the payload are unaffected; handlers typed against the old `connectEnd`/`reconnect*` payloads need updating to the new object shapes.

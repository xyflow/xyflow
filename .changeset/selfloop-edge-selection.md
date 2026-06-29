---
"@xyflow/system": patch
---

Fix self-loop edges created in `onConnect` not keeping their `selected` state. Completing a connection on the same node no longer fires a node click that clears the new edge's selection.

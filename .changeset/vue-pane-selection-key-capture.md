---
"@xyflow/vue": patch
---

Holding the selection key now starts a selection box even when the drag begins over a node or edge.
The element underneath no longer starts a drag of its own. A child marked with `nokey` still opts out, and a secondary pointer no longer opens a box.

---
"@xyflow/vue": patch
---

Don't start a selection box on touch when panning is enabled. A `panOnDrag` button array only restricts mouse input, so a touch drag now pans as it does in `@xyflow/react`, unless the selection key is held.

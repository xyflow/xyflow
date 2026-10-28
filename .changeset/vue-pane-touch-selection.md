---
"@xyflow/vue": patch
---

Don't start a selection box on touch when panning is enabled. A `panOnDrag` button array only restricts mouse input, so a touch drag now pans, unless the selection key is held.

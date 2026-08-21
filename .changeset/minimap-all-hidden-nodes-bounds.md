---
"@xyflow/react": patch
---

Fix the `MiniMap` zooming out to include the origin when every node is hidden. The bounds are calculated from the visible nodes only, so the minimap now falls back to the viewport rect when no node is visible, like it already does for an empty flow.

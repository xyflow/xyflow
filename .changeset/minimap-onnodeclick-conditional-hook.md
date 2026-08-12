---
"@xyflow/react": patch
---

Fix `MiniMap` calling `useCallback` conditionally for `onNodeClick`, which crashed with "Rendered more hooks than during the previous render" when the prop was toggled on or off, and pinned the handler to its first-render value.

---
"@xyflow/react": patch
---

Fix `useKeyPress` never firing for key combinations of three or more keys (e.g. `'Meta+Shift+s'`). Only the first `+` was replaced when splitting the combination, so the remaining keys were parsed as a single unmatchable key.

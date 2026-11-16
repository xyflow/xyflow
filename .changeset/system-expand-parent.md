---
"@xyflow/vue": major
---

Use `@xyflow/system`'s parent expansion for `expandParent` nodes when dragging, measuring and resizing, matching `@xyflow/react`:

- A child dragged past its parent's top/left edge now grows the parent up/left, and its siblings are offset so they stay in place.
- `node.origin` is respected when a resize expands the parent.
- Keyboard moves of nodes with an `extent` no longer stop a full node width/height short of the boundary.

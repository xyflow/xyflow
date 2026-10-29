---
"@xyflow/vue": major
---

Adopt `@xyflow/system`'s `handleExpandParent` for `expandParent` nodes and make the `CoordinateExtentRange` `padding` actually apply.

Parent expansion (a child with `expandParent: true` growing its parent to fit) is now delegated to `@xyflow/system` — the same engine `xyflow/react`/`xyflow/svelte` use — replacing vue-flow's hand-maintained `handleParentExpand`. Wired at the three points system/react do: dragging (`updateNodePositions`), measurement (`updateNodeDimensions`), and resizing (`<NodeResizer>` / `ResizeControl`). Behaviour now matches xyflow/react exactly:

- a child dragged past its parent's **top/left** pins its relative position at `0` and grows the parent up/left (instead of the previous in-place style mutation), and sibling children are counter-offset so they stay put;
- `node.origin` is respected when a resize expands the parent.

`CoordinateExtentRange` extents (`extent: { range, padding }`) now honour their `padding` again. The `@xyflow/system` migration had reduced such extents to their bare `range` for the system clamp, silently dropping the inset; the store now re-applies the padding (the same `getExtent` math the keyboard-move path uses) after computing absolute positions, and coerces the range form safely around `adoptUserNodes` (which previously crashed on a `{ range, padding }` extent).

Fixed a double-clamp in `calcNextPosition`: it pre-shrank the extent by the node's dimensions and then `clampPosition` subtracted them again, so extent-constrained keyboard moves stopped a full node width/height short of the boundary. Extent clamping now matches `@xyflow/system`.

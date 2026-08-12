---
"@xyflow/vue": major
---

Reuse `@xyflow/system` primitives instead of re-implementing them.

- **Type guards** — `isNode` / `isEdge` / `isInternalNode` now delegate to the system's `isNodeBase` / `isEdgeBase` / `isInternalNodeBase` (single source of truth, matching xyflow/react & xyflow/svelte). Public signatures are unchanged; `isInternalNodeBase` is now re-exported as well.
- **Padding** — `fitView` / `fitBounds` and a node `extent`'s `CoordinateExtentRange` now use the system's `Padding` type, and `Padding` / `PaddingWithUnit` / `PaddingUnit` are re-exported.
  - **Breaking:** the extent padding's positional-tuple form (`[y, x]`, `[top, x, bottom]`, `[top, right, bottom, left]`) is removed. Use the object form instead, e.g. `{ top: 10, left: 20 }` or the `x` / `y` shorthands.
  - `fitView` / `fitBounds` `padding` now accepts per-side values and `px` / `%` units (previously `number` only). A `%` extent padding resolves against the parent's width/height.

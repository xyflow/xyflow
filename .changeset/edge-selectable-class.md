---
"@xyflow/vue": patch
---

Add the `selectable` class to edges. The edge `<g>` now carries a `selectable` class whenever the edge is selectable (its own `selectable` flag, or `elementsSelectable` when unset), and the CSS keys `cursor: pointer` and the focus edge-path stroke off `.selectable`. Previously `cursor: pointer` was applied to every edge unconditionally, so **non-selectable edges no longer show the pointer cursor**.

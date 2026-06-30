---
"@xyflow/system": patch
---

Cache the zoom pane extent so wheel zoom no longer forces a synchronous layout. d3-zoom's `defaultExtent` reads `clientWidth`/`clientHeight` on every wheel event; backing the extent with a `ResizeObserver`-refreshed cache moves that read off the hot path and removes the per-wheel forced reflow. Behavior is unchanged.

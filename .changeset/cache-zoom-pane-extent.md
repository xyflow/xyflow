---
"@xyflow/system": patch
---

Cache the zoom pane extent so panning and pinching no longer force a synchronous layout. d3-zoom's `defaultExtent` reads `clientWidth`/`clientHeight` on every pan and pinch scroll event; backing the extent with a `ResizeObserver`-refreshed cache moves that read off the hot path and removes the per-event forced reflow. Behavior is unchanged.

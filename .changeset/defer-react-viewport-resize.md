---
'@xyflow/react': patch
---

Avoid ResizeObserver notification loops when viewport resizing updates other observed elements. Coalesce viewport size updates into the next animation frame and cancel pending updates when the flow unmounts.

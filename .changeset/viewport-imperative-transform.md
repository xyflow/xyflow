---
"@xyflow/react": patch
---

Apply the viewport pan/zoom transform imperatively so the `Viewport` component renders once instead of re-rendering on every pan/zoom frame. DOM output and update cadence are unchanged.

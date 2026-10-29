---
"@xyflow/vue": minor
---

Add a `connectionDragThreshold` prop. It's the distance in pixels the pointer must move from a handle before a connection line starts to drag — useful to prevent accidental connections when you just click a handle. Defaults to `1`; set it higher (e.g. `connectionDragThreshold="25"`) to require a more deliberate drag, or `0` to start the connection immediately on pointer-down. Below the threshold, neither `connectStart` nor `connectEnd` fires.

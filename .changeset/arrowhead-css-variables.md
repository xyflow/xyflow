---
"@xyflow/vue": minor
---

Allow theming arrowhead markers with the `--xy-edge-stroke` CSS variable. `defaultMarkerColor` now accepts `null` — pass it (or leave a marker's `color` unset) and the arrowhead inherits `--xy-edge-stroke` instead of the hard-coded `#b1b1b7`, so markers can match themed edge colors. The marker polylines carry `.arrow` / `.arrowclosed` classes and only set an inline color when one is provided; the open arrow strokes only, the closed arrow strokes and fills. The default (`#b1b1b7`) is unchanged.

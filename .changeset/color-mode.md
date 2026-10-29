---
"@xyflow/vue": minor
---

Add a `forceColorMode` prop (`'light' | 'dark'`) to pin the theme, matching xyflow. By default (unset) the flow follows the OS `prefers-color-scheme`: the `.vue-flow` container declares `color-scheme: light dark`, so the `--xy-*` values (via the CSS `light-dark()` function) resolve to the OS preference and react to changes at runtime — no JavaScript watcher needed. Set `force-color-mode="dark"` or `"light"` to force one: the value is applied as a class on the `.vue-flow` container, which pins `color-scheme` so `light-dark()` resolves to that mode.

The default theme ships a dark palette out of the box: built-in nodes, edges, handles, `Controls`, and `MiniMap` adapt automatically through the `--xy-*` `light-dark()` variables. Existing light-mode appearance is unchanged. (The theme is driven by the `--xy-*` CSS variables — see the separate CSS-alignment changeset.)

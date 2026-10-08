---
"@xyflow/vue": major
---

The connection status is now applied to the connection line's group rather than its path. While a connection is being dragged, `valid` or `invalid` lands on `<g class="vue-flow__connection">`; the `<path>` keeps `vue-flow__connection-path` plus whatever you pass as `connectionLineClass`.

`.vue-flow__connection.valid` and `.vue-flow__connection.invalid` now match, which is where these selectors are documented to live. **If you style `.vue-flow__connection-path.valid` or `.vue-flow__connection-path.invalid`, move those rules up to `.vue-flow__connection.valid` / `.invalid`** — a descendant selector such as `.vue-flow__connection.valid .vue-flow__connection-path` keeps the path itself as the target.

---
"@xyflow/vue": minor
---

`edgesReconnectable` and `elevateEdgesOnSelect` now default to `true`.

Edges are reconnectable by default (this only takes effect once you handle `@reconnect`), and selected edges are raised above their siblings. To keep the previous behavior, set `:edges-reconnectable="false"` and/or `:elevate-edges-on-select="false"` on `<VueFlow>`.

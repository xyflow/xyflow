---
"@xyflow/vue": patch
---

Fix `fitView`'s `includeHiddenNodes` option being ignored. It was accepted in `FitViewParams` (and defaulted to `false`) but never forwarded to the underlying `fitViewport` call, so `fitView({ includeHiddenNodes: true })` (and `:fit-view-on-init` with it) silently excluded hidden nodes. It's now passed through, so hidden nodes (that have known dimensions) participate in the fit when requested.

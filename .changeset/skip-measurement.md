---
'@xyflow/react': minor
'@xyflow/svelte': minor
'@xyflow/system': patch
---

Add an opt-in `skipMeasurement` flag on nodes. It is honored only while you provide the values it would otherwise measure: real dimensions (`width`/`height` or `measured`) and `handles` (use `handles: []` for a node without handles). While honored the node is never measured (not by the ResizeObserver, on type/handle-position changes, nor by an explicit `updateNodeInternals`), so the per-node measurement pass is skipped entirely on mount and on add; those provided values are authoritative. If the values are missing the flag is ignored and the node is measured normally, so it cannot render broken. Useful for static or read-only nodes whose size the app already knows; the saving scales with the number of handles per node. Opt-in, so the default path is unchanged.

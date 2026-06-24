---
'@xyflow/react': minor
'@xyflow/system': minor
---

Add an opt-in `patchNodes` for keyed node updates. `patchNodes([{ id, ...partial }])` writes the
patched nodes straight into the internal node store (O(changed) plus any children whose absolute
position moves) and wakes only those nodes through the per-node channel, with their incident edges
re-pathed. It bypasses the nodes array, `onNodesChange`, z-index / selection recompute, culling and
the controlled `nodes` prop, so pair it with `useInternalNode` / `useNode` for reads and drive
re-parenting, selection and structural changes through `setNodes`.

`useInternalNode` now subscribes through the per-node channel, so it reflects `patchNodes` writes.
`@xyflow/system` exports `getNodePositionAbsolute` for the shared absolute-position derivation.

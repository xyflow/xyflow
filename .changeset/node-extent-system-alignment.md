---
"@xyflow/vue": major
---

Align node `extent` typing with `@xyflow/system`:

- Collapse the local `CoordinateExtent` type onto the one from `@xyflow/system` (they were identical) — it is now re-exported from `@xyflow/system`.
- Remove `CoordinateExtentRange` and the per-node "clamp to parent **with padding**" extent form (`extent: { range, padding }`). `node.extent` and the `nodeExtent` prop now accept exactly what the system understands: `"parent" | CoordinateExtent | null`. Use `extent: "parent"` to clamp a child to its parent. This drops a vue-flow-only workaround that could not be cleanly typed against `@xyflow/system`; if padded clamping returns it will be a system-level feature. To inset from the parent in the meantime, apply the offset yourself.

---
"@xyflow/vue": minor
---

Add `onBeforeDelete` and `deleteElements` (xyflow/react parity).

- **`onBeforeDelete`** prop — `(params: { nodes, edges }) => Promise<boolean | { nodes, edges }>`, consulted before delete-key removals and `deleteElements`. Return `false` to cancel, `true` to delete the gathered set, or `{ nodes, edges }` to delete only a subset.
- **`deleteElements({ nodes, edges })`** action — gathers the targeted nodes plus their child nodes and connected edges (skipping `deletable: false`), runs `onBeforeDelete`, removes the resolved set, and resolves to `{ deletedNodes, deletedEdges }`.

The Delete key now routes through `deleteElements`, so a single keypress can confirm/cancel a node together with its edges. Low-level `removeNodes`/`removeEdges` stay hook-free. Resolves the tracked enhancement in #1630.

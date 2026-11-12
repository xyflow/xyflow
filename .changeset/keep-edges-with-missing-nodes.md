---
"@xyflow/vue": patch
---

`setEdges`/`addEdges` no longer drop edges whose source or target node isn't in the store. Previously `validateEdges` discarded any edge with a missing endpoint at commit time, which silently deleted edges and made the order of `setNodes`/`setEdges` matter — adding edges before their nodes lost them. Edges are now kept and `EdgeWrapper` skips drawing them (emitting the existing `EDGE_SOURCE_MISSING`/`EDGE_TARGET_MISSING` dev warning) until both nodes exist, matching `@xyflow/react` & `@xyflow/svelte`. The `isValidConnection` gate still runs whenever both endpoint nodes are resolvable.

---
"@xyflow/vue": minor
---

Discriminate the `#node-<type>` / `#edge-<type>` slot props by node/edge type. When `nodes`/`edges` are typed as a discriminated union (e.g. `(MyNodeA | MyNodeB)[]`), each `#node-<type>` / `#edge-<type>` slot now narrows its props to the matching variant's `NodeProps` / `EdgeProps`, so a custom node/edge component can safely type its `data` without a cast. Generic `Node[]` / `Edge[]` flows are unchanged (props stay broad), and arbitrary slot names remain allowed (a broad `node-${string}` / `edge-${string}` fallback). Type-only.

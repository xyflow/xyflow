---
"@xyflow/vue": minor
---

Thread the flow's `NodeType`/`EdgeType` through a few more public types so a typed flow gets specific typing instead of the generic default:

- `ConnectionLineProps<NodeType>` — the `#connection-line` slot now types `fromNode`/`toNode` as `InternalNode<NodeType>` (inferred from `:nodes`), so a custom connection-line component gets typed node `data`. It was the only `FlowSlots` slot that didn't carry the flow's `NodeType`.
- `RemoveNodes<NodeType>` / `RemoveEdges<EdgeType>` — the functional-updater form now receives the flow's node/edge type, matching `SetNodes`/`AddNodes`.
- `IsNodeIntersecting<NodeType>` — mirrors its sibling `GetIntersectingNodes<NodeType>`.

All generics default to `Node`/`Edge`, so existing code is unaffected. Type-only, no runtime change.

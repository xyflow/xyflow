---
"@xyflow/vue": patch
---

Resolve a node or edge component from the registered types directly instead of the `getNodeTypes`/`getEdgeTypes` registries. Those registries are derived from the node and edge arrays, so every wrapper was subscribed to the whole array and one moved node invalidated all of them.

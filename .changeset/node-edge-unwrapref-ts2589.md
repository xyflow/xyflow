---
"@xyflow/vue": patch
---

Fix the flaky `TS2589: Type instantiation is excessively deep and possibly infinite` that could appear on the most common state-update pattern, `nodes.value = nodes.value.map((n) => ({ ...n, position }))` and the edge equivalent, typically surfacing intermittently in long-running editor type-checkers (clears on a TS-server restart, then returns).

`ref<Node[]>` makes `.value` an `UnwrapRef<Node[]>`, and Vue's `UnwrapRef` recursively walks the entire `Node` type, including `style`'s `CSSProperties` (hundreds of large string-literal unions). A single spread-map therefore cost ~426k type instantiations, sitting right on TypeScript's instantiation-depth limit. Nodes and edges contain no refs, so unwrapping them is pure overhead: `@xyflow/vue` now opts them out via Vue's `RefUnwrapBailTypes` (the same hook Vue uses to bail DOM `Node`/`Window`), dropping the same operation to ~1k instantiations. Type-only, no runtime change.

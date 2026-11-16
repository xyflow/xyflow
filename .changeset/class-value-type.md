---
"@xyflow/vue": major
---

Type the `class` property as `ClassValue` (`string | Record<string, boolean> | ClassValue[]`, mirroring the Vue class-binding type) on `Node`, `Edge` and the `connectionLineClass` prop, replacing the looser `string | string[] | Record<string, any>`.

The **function form** for `class` and `style` (`(el) => value`) is removed. It was never part of the public type — only a dead runtime branch in the node/edge wrappers — and passing a function produced a broken native render anyway. Pass a resolved `ClassValue` / style object instead (compute it in your own component if it needs to be dynamic).

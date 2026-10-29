---
"@xyflow/vue": major
---

Add an explicit `selectionOnDrag` prop and drop the `selectionKeyCode={true}` overload.

Drawing a selection box on a plain pane drag (no key held) used to be expressed by setting `selectionKeyCode` to `true`, which overloaded the key-code prop. It's now its own boolean prop:

```vue
<!-- before -->
<VueFlow :selection-key-code="true" :pan-on-drag="false" />
<!-- after -->
<VueFlow :selection-on-drag="true" :pan-on-drag="false" />
```

`selectionKeyCode` is once again just the key you hold to select (default `'Shift'`). As part of this, `selectionOnDrag` is threaded to the pan/zoom instance so `paneClick` fires while selecting on drag (it was previously swallowed by d3-zoom's click handling — xyflow/react #5572).

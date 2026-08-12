---
"@xyflow/vue": patch
---

Edge rendering cleanup (DOM hygiene + per-frame perf):

- The built-in edge components (`straight`/`bezier`/`smoothstep`/`step`/`simplebezier`) no longer leak their geometry/identity props onto the `<path>` element. Previously they spread `{ ...attrs, ...props }` into `BaseEdge` (whose root does `v-bind="$attrs"`), so every edge path carried bogus attributes — `source`, `target`, `sourcePosition`, `targetPosition`, `reconnectable`, `selectable`, `animated`, and the per-frame-changing `sourceX`/`sourceY`/`targetX`/`targetY`. `BaseEdge` now receives only the props it renders (path, label/marker/interaction + genuine `style`/`class`), and the built-in edge components set `inheritAttrs: false`. The four position attrs were re-written on every drag frame, so this also trims `setAttribute` work during drags.
- `EdgeText` no longer re-measures its label (`getBBox`, a forced reflow) on every `x`/`y` change — the text's bounding box is position-independent, so it now only re-measures when the label/element changes. Removes a per-frame reflow for labeled edges during drag.

Custom edge components are unaffected (they pass their own props to `BaseEdge`). Edge `style`, labels, and markers still render exactly as before.

---
"@xyflow/vue": patch
---

Honor `width`/`height` and `initialWidth`/`initialHeight` in the node visibility gate and inline size. The node wrapper previously gated visibility on `measured` alone, so a node sized via `width`/`initialWidth` stayed `visibility: hidden` until the `ResizeObserver` measured it, and in SSR (no `ResizeObserver`) it never became visible. Visibility now uses `@xyflow/system`'s `nodeHasDimensions` (`measured ?? width ?? initialWidth`), and the wrapper's inline size falls back through `initialWidth`/`initialHeight` before the node is measured (`initialWidth`/`initialHeight` are the SSR dimensions, since DOM can't be measured server-side).

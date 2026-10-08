---
"@xyflow/vue": minor
---

Add an `orientation` prop to `<Controls>` (`'vertical' | 'horizontal'`, default `'vertical'`). The stylesheet has always shipped `.vue-flow__controls.horizontal { flex-direction: row }`, but the component never applied an orientation class, so a horizontal control bar was unreachable.

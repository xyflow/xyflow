---
"@xyflow/vue": major
---

`<Background>`'s pattern is now colored by the stylesheet rather than by an inline `fill`/`stroke`. The pattern elements carry a `vue-flow__background-pattern <variant>` class, and the stylesheet resolves `--xy-background-pattern-<variant>-color-default` through `light-dark()`, so the pattern follows the color scheme instead of sitting at a fixed light-mode color.

Previously the color was resolved in JS from a hardcoded `{ lines: '#eee', dots: '#91919a' }` map and written as an inline attribute, which always won over the stylesheet — in dark mode that drew a light-grey pattern on a dark canvas.

If you relied on those hardcoded light colors, pass them explicitly: `<Background color="#91919a" />` for dots, `<Background variant="lines" color="#eee" />` for lines.

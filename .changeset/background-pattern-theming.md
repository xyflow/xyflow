---
"@xyflow/vue": major
---

`<Background>`'s pattern is now colored by the stylesheet rather than by an inline `fill`/`stroke`.
Previously the color was resolved in JS from a hardcoded `{ lines: '#eee', dots: '#91919a' }`.

If you relied on those hardcoded light colors, pass them explicitly: `<Background color="#91919a" />` for dots, `<Background variant="lines" color="#eee" />` for lines.

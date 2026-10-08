---
"@xyflow/vue": minor
---

Add the `cross` background variant. `BackgroundVariant` is now `'dots' | 'lines' | 'cross'`. The stylesheet already shipped `--xy-background-pattern-cross-color-default` and a rule to go with it, but the variant could not be selected — passing it rendered nothing.

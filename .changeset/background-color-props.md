---
"@xyflow/vue": minor
---

Add `bgColor` and `patternClassName` props to `<Background>`. `color` and `bgColor` are applied as the `--xy-background-pattern-color-props` and `--xy-background-color-props` custom properties, so an explicit color still takes precedence over the themed default. `patternClassName` is applied to the pattern element alongside `vue-flow__background-pattern`.

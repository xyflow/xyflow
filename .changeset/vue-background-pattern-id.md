---
"@xyflow/vue": patch
---

Build the `<Background>` pattern element id as `pattern-<flowId><id>`, matching `@xyflow/react`. It previously inserted a hyphen (`pattern-flow-a-0` instead of `pattern-flow-a0`), so CSS or tests written against a React flow did not match.

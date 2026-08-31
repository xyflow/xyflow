---
"@xyflow/vue": patch
---

Fix the `useKeyPress` `preventDefault` option, which was inverted. It now calls `preventDefault()` by default and only skips it when set to `false` — previously `preventDefault: true` was what disabled it. The default behavior is unchanged; if you explicitly set this option, flip the value.

---
"@xyflow/vue": patch
---

Emit the `init` event from `watch(..., { flush: 'post' })` instead of `setTimeout(() => …, 1)`. It still fires once, after the viewport is initialized and applied to the DOM (so `@init`/`onInit` consumers see the ready viewport), but the timing is now deterministic (post-render) rather than a 1ms macrotask.

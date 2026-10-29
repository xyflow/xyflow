---
"@xyflow/vue": minor
---

Remove the `vueFlowVersion` field from the flow instance (`useVueFlow().vueFlowVersion`) and the build-time `__VUE_FLOW_VERSION__` injection. It was exposed but never used internally and has no equivalent in xyflow/react; read your installed version from your package manager or `@xyflow/vue/package.json` instead.

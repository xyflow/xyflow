---
"@xyflow/vue": minor
---

Add an `ariaLabelConfig` prop to customize the accessibility text. Pass a `Partial<AriaLabelConfig>` (merged over the defaults) to override any of the node/edge a11y descriptions, the aria-live "moved node" message, and the Controls / MiniMap / Handle aria labels. As part of this, the Controls buttons and Handle — which previously had no `aria-label` — now get accessible labels, the Controls panel gets a `Control Panel` label, and the MiniMap label default moves into the config. `AriaLabelConfig` is re-exported from the package root.

---
"@xyflow/vue": patch
---

Export `ResizeControlVariant` as a value, not type-only. It is a runtime enum, but the bundled type declarations re-exported it through the NodeResizer barrel as `export type`, so `ResizeControlVariant.Line` / `.Handle` could not be used as a value in TypeScript consumers. It is now re-exported directly from the package root as a value.

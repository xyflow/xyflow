---
'@xyflow/react': patch
---

Add `@types/react` and `@types/react-dom` as optional peer dependencies so the package resolves React types under pnpm strict mode (`hoist: false`) without forcing JavaScript consumers to install the type packages.

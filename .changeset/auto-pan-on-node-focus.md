---
"@xyflow/vue": minor
---

Add `autoPanOnNodeFocus` (default `true`), mirroring xyflow/react. When a node receives keyboard focus (Tab) and isn't within the viewport, the viewport pans to center it — so keyboard navigation never lands on an off-screen node. Only reacts to keyboard focus (`:focus-visible`), not pointer/programmatic focus. Set `auto-pan-on-node-focus="false"` (or pass `false`) to disable.

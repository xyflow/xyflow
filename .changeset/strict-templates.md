---
"@xyflow/vue": patch
---

Type-check component templates under `strictTemplates` and fix what it surfaced in core:

- `ControlButton` now declares its `disabled` prop and `click` emit instead of relying on attribute fall-through. Its rendered output and behaviour are unchanged.
- The `NodesSelection` rectangle binds the correct lowercase `tabindex` attribute (was `tabIndex`).
- The handle's identifier `data-*` attributes (`data-id` et al., queried during connection) are bound through a typed record — no rendered change.

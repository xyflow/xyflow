---
"@xyflow/vue": patch
---

Give the edge wrapper's `<g>` a flat child list. The nested array made Vue build and diff a Fragment on every render of every edge, including the common case where both reconnect anchors are absent.

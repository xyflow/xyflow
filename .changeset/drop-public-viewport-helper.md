---
"@xyflow/vue": major
---

Remove the redundant `viewportHelper` `ComputedRef` from the `useVueFlow()` instance. The viewport functions (`setCenter`, `fitView`, `zoomIn`, `zoomOut`, `zoomTo`, `setViewport`, `getViewport`, `fitBounds`, `screenToFlowPosition`, `flowToScreenPosition`) are already exposed **flat** on the instance so the nested `viewportHelper` was duplicate surface.

- `useVueFlow().viewportHelper.value.setCenter(…)` → `useVueFlow().setCenter(…)` (and likewise for the other viewport functions).
- The init flag moves to a flat `viewportInitialized` (`ComputedRef<boolean>`): `useVueFlow().viewportHelper.value.viewportInitialized` → `useVueFlow().viewportInitialized.value`.

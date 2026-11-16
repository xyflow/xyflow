---
"@xyflow/react": major
---

Replace `useStore` with `useNodesStore`, `useEdgesStore`, `useViewportStore`, `useOptionsStore`, `useConnectionStore` and `useSelectionStore`. They no longer accept an equality function, use `useShallow` instead.

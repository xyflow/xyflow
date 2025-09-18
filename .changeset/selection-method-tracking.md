---
"@xyflow/react": minor
"@xyflow/system": minor
---

Add selection method tracking to node/edge selection events

- Add `selectionMethod` field to `NodeSelectionChange` and `EdgeSelectionChange` types
- Track 6 different selection methods: click, drag, rectangle, keyboard, multi-select, programmatic
- Update selection logic across all interaction points
- Add `selectionMethod` parameter to `addSelectedNodes` and `addSelectedEdges` actions
- Create comprehensive SelectionMethod example with real-time tracking and visual indicators
- Maintain backward compatibility - `selectionMethod` field is optional

This enables developers to understand how selections occurred and implement different behaviors based on selection method (e.g., different UI feedback for click vs drag selection).

# Keyboard workflow outline

An example proposal for [#5189](https://github.com/xyflow/xyflow/issues/5189), following the maintainer's preference for an example rather than changing core focus order.

The application supplies a reading order in `initialNodes`. It is independent of layout and connection direction: branching graphs and cycles do not have one universal linear order. Each step appears once in a native ordered list; outgoing connection buttons expose branches and return loops without recursive traversal. Hidden nodes and edges are omitted.

- Tab reaches ordinary outline buttons in document order. Enter/Space selects a step without moving the viewport.
- “Show on canvas” pans without animation and focuses the actual React Flow node. Native focus also reveals the canvas when the narrow layout places it below the outline. Arrow-key movement remains provided by React Flow. Escape restores focus and visibility to the corresponding outline button.
- Canvas node wrappers use the supported `domAttributes.tabIndex = -1` escape hatch. Edges are removed from the tab sequence with `edgesFocusable={false}` because their connections have equivalent controls in the outline. No positive tab indices, DOM reordering, or core changes are needed.
- Removing the selected step returns focus to the next surviving outline item, or to Reset when empty. React Flow removes its incident edges through `deleteElements`.
- Controls, Background, node/edge rendering, and canvas CSS are the existing React Flow components/styles. The sidebar uses native HTML controls and scoped styles matching the default example theme; it has no UI-library dependency.

This is an application-level navigation pattern, not a claim that all graph editors should remove edges from the tab order. An editor with interactive edge editing must expose those actions in its alternative view too. The example uses visible labels as node names; a production application should define domain-specific descriptions and validate the full workflow with its screen-reader users.

Run the existing React examples and open `/examples/keyboard-outline`.

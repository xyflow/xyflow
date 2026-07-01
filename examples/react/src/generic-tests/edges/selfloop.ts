/*
 * Test setup for issue #5833 (self-loop edge selection).
 * Keeps the default nodeDragThreshold (1) so node selection runs through the
 * click handler - the code path where the bug occurs. (nodes/general sets it to
 * 0, which routes selection through XYDrag and hides the bug.)
 */
export default {
  flowProps: {
    fitView: true,
    nodes: [
      { id: 'A', data: { label: 'A' }, position: { x: 0, y: 0 } },
      { id: 'B', data: { label: 'B' }, position: { x: 200, y: 150 } },
    ],
    edges: [],
  },
} satisfies FlowConfig;

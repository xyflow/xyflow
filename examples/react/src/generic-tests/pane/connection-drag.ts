// Fixture for tests covering https://github.com/xyflow/xyflow/issues/5757
// Ending a connection drag on the pane background must NOT trigger `onPaneClick`.

export default {
  flowProps: {
    minZoom: 0.25,
    maxZoom: 4,
    fitView: true,
    nodes: [
      {
        id: 'source',
        position: { x: 0, y: 0 },
        data: { label: 'source' },
      },
      {
        id: 'target',
        position: { x: 200, y: 200 },
        data: { label: 'target' },
      },
    ],
    edges: [
      {
        id: 'first-edge',
        source: 'source',
        target: 'target',
      },
    ],
    onPaneClick: () => {
      // Record each pane click on the window so a Playwright test can assert
      // that drag-end of a connection does not synthesise a spurious click.
      const w = window as unknown as { __paneClicks?: number };
      w.__paneClicks = (w.__paneClicks ?? 0) + 1;
    },
  },
} satisfies FlowConfig;

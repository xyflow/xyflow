// Shared Common Props args for React and Svelte stories

export const baseCommonPropsArgs = {
  width: undefined as number | undefined,
  height: undefined as number | undefined,
  nodes: [
    { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 100, y: 50 } },
    { id: '2', data: { label: 'Node 2' }, position: { x: 300, y: 150 } },
  ],
  edges: [] as any[],
  nodeTypes: undefined as Record<string, any> | undefined,
  edgeTypes: undefined as Record<string, any> | undefined,
  paneClickDistance: 0,
  nodeClickDistance: 0,
  autoPanOnNodeFocus: true,
  nodeOrigin: [0, 0] as [number, number],
  proOptions: undefined as any,
  nodeDragThreshold: 1,
  connectionDragThreshold: 1,
  // colorMode is framework-specific by default; set per framework below
  colorMode: undefined as any,
  ariaLabelConfig: undefined as any,
};

export const reactOnlyCommonPropsArgs = {
  defaultNodes: [] as any[],
  defaultEdges: [] as any[],
  debug: false,
  colorMode: 'light' as 'light' | 'dark',
};

export const svelteOnlyCommonPropsArgs = {
  autoPanSpeed: 15,
  panOnScrollSpeed: 0.5,
  colorMode: 'system' as 'system' | 'light' | 'dark',
  colorModeSSR: undefined as 'light' | 'dark' | undefined,
};

export const getReactCommonArgs = (overrides: Record<string, any> = {}) => ({
  ...baseCommonPropsArgs,
  ...reactOnlyCommonPropsArgs,
  ...overrides,
});

export const getSvelteCommonArgs = (overrides: Record<string, any> = {}) => ({
  ...baseCommonPropsArgs,
  ...svelteOnlyCommonPropsArgs,
  ...overrides,
});

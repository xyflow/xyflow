// Storybook argTypes based on ReactFlow and SvelteFlow component props
// Note: Some props may be specific to one framework - check descriptions

export const argTypes = {
  defaultEdgeOptions: {
    description: 'Default options to be applied to all new edges',
    control: { type: 'object' },
  },

  // Viewport Configuration
  fitView: {
    description: 'Automatically fit view to show all nodes on initial render',
    control: { type: 'boolean' },
  },
  fitViewOptions: {
    description: 'Options for fitView behavior (padding, duration, etc.)',
    control: { type: 'object' },
  },
  viewport: {
    description: 'Controlled viewport state (x, y, zoom). In Svelte, use initialViewport for default',
    control: { type: 'object' },
  },
  defaultViewport: {
    description: 'Initial viewport position and zoom (React only)',
    control: { type: 'object' },
  },
  initialViewport: {
    description: 'Initial viewport position and zoom (Svelte only)',
    control: { type: 'object' },
  },
  minZoom: {
    description: 'Minimum zoom level',
    control: { type: 'number', min: 0.1, max: 2, step: 0.1 },
  },
  maxZoom: {
    description: 'Maximum zoom level',
    control: { type: 'number', min: 1, max: 10, step: 0.5 },
  },
  translateExtent: {
    description: 'Boundary for viewport movement [[minX, minY], [maxX, maxY]]',
    control: { type: 'object' },
  },

  // Node Configuration
  nodeOrigin: {
    description: 'Origin point for node positioning [x, y]. [0,0] = top-left, [0.5,0.5] = center',
    control: { type: 'object' },
  },
  nodeExtent: {
    description: 'Boundary for node placement [[minX, minY], [maxX, maxY]]',
    control: { type: 'object' },
  },
  nodesDraggable: {
    description: 'Controls whether all nodes are draggable by default',
    control: { type: 'boolean' },
  },
  nodesConnectable: {
    description: 'Controls whether all nodes are connectable by default',
    control: { type: 'boolean' },
  },
  nodesFocusable: {
    description: 'Controls whether nodes can be focused with Tab key',
    control: { type: 'boolean' },
  },
  selectNodesOnDrag: {
    description: 'Automatically select nodes when dragging them',
    control: { type: 'boolean' },
  },
  elevateNodesOnSelect: {
    description: 'Raise z-index of nodes when selected',
    control: { type: 'boolean' },
  },
  autoPanOnNodeDrag: {
    description: 'Auto-pan viewport when dragging node near edge',
    control: { type: 'boolean' },
  },
  autoPanOnNodeFocus: {
    description: 'Auto-pan viewport when node is focused',
    control: { type: 'boolean' },
  },

  // Edge Configuration
  edgesFocusable: {
    description: 'Controls whether edges can be focused with Tab key',
    control: { type: 'boolean' },
  },
  edgesReconnectable: {
    description: 'Whether edges can be reconnected by dragging (React only)',
    control: { type: 'boolean' },
  },
  elevateEdgesOnSelect: {
    description: 'Raise z-index of edges when selected',
    control: { type: 'boolean' },
  },

  // Connection Configuration
  connectionMode: {
    description: 'Connection mode: strict (source to target only) or loose (any to any)',
    options: ['strict', 'loose'],
    control: { type: 'radio' },
  },
  connectionLineType: {
    description: 'Type of connection line path',
    options: ['default', 'straight', 'step', 'smoothstep', 'bezier'],
    control: { type: 'select' },
  },
  connectionLineStyle: {
    description: 'CSS styles for connection line (React: CSSProperties, Svelte: string)',
    control: { type: 'text' },
  },
  connectionLineContainerStyle: {
    description: 'CSS styles for connection line container (React: CSSProperties, Svelte: string)',
    control: { type: 'text' },
  },
  connectionLineComponent: {
    description: 'Custom component for connection line',
    control: { type: 'object' },
  },
  connectionRadius: {
    description: 'Radius around handle to drop connection line and create edge',
    control: { type: 'number', min: 0, max: 100, step: 5 },
  },
  connectionDragThreshold: {
    description: 'Distance mouse must move before connection line starts dragging',
    control: { type: 'number', min: 0, max: 20, step: 1 },
  },
  connectOnClick: {
    description: 'Allow creating connections by clicking handles (React: connectOnClick, Svelte: clickConnect)',
    control: { type: 'boolean' },
  },
  autoPanOnConnect: {
    description: 'Auto-pan viewport when creating connection near edge',
    control: { type: 'boolean' },
  },
  reconnectRadius: {
    description: 'Radius around edge connection for triggering reconnection (React only)',
    control: { type: 'number', min: 0, max: 50, step: 5 },
  },
  isValidConnection: {
    description: 'Function to validate connections',
    control: { type: 'object' },
  },

  // Selection Configuration
  selectionMode: {
    description: 'Selection box mode: full (completely inside) or partial (partially inside)',
    options: ['full', 'partial'],
    control: { type: 'radio' },
  },
  selectionOnDrag: {
    description: 'Enable selection box without pressing selection key',
    control: { type: 'boolean' },
  },
  elementsSelectable: {
    description: 'Controls whether elements can be selected',
    control: { type: 'boolean' },
  },

  // Interaction Keys
  deleteKeyCode: {
    description: 'Key(s) to delete selected elements (React: deleteKeyCode, Svelte: deleteKey)',
    control: { type: 'text' },
  },
  selectionKeyCode: {
    description: 'Key(s) to enable selection box (React: selectionKeyCode, Svelte: selectionKey)',
    control: { type: 'text' },
  },
  multiSelectionKeyCode: {
    description: 'Key(s) to enable multi-selection (React: multiSelectionKeyCode, Svelte: multiSelectionKey)',
    control: { type: 'text' },
  },
  panActivationKeyCode: {
    description: 'Key(s) to enable panning (React: panActivationKeyCode, Svelte: panActivationKey)',
    control: { type: 'text' },
  },
  zoomActivationKeyCode: {
    description: 'Key(s) to enable zooming (React: zoomActivationKeyCode, Svelte: zoomActivationKey)',
    control: { type: 'text' },
  },

  // Panning Configuration
  panOnDrag: {
    description: 'Enable panning by dragging. Can be array of mouse button numbers',
    control: { type: 'boolean' },
  },
  panOnScroll: {
    description: 'Enable panning by scrolling',
    control: { type: 'boolean' },
  },
  panOnScrollMode: {
    description: 'Direction of panning when panOnScroll is enabled',
    options: ['free', 'horizontal', 'vertical'],
    control: { type: 'radio' },
  },
  panOnScrollSpeed: {
    description: 'Speed of viewport panning on scroll',
    control: { type: 'number', min: 0.1, max: 2, step: 0.1 },
  },
  preventScrolling: {
    description: 'Prevent page scrolling when pointer is over the flow',
    control: { type: 'boolean' },
  },
  autoPanSpeed: {
    description: 'Speed of auto-panning when dragging near edge',
    control: { type: 'number', min: 1, max: 50, step: 1 },
  },

  // Zooming Configuration
  zoomOnScroll: {
    description: 'Enable zooming by scrolling',
    control: { type: 'boolean' },
  },
  zoomOnPinch: {
    description: 'Enable zooming by pinching on touch screens',
    control: { type: 'boolean' },
  },
  zoomOnDoubleClick: {
    description: 'Enable zooming by double-clicking',
    control: { type: 'boolean' },
  },

  // Snapping Configuration
  snapToGrid: {
    description: 'Enable snapping nodes to grid when dragging (React only)',
    control: { type: 'boolean' },
  },
  snapGrid: {
    description: 'Grid size for snapping [x, y]',
    control: { type: 'object' },
  },

  // Interaction Thresholds
  nodeDragThreshold: {
    description: 'Distance in pixels node must be dragged before drag starts',
    control: { type: 'number', min: 0, max: 100, step: 1 },
  },
  paneClickDistance: {
    description: 'Distance mouse can move between mousedown/up to trigger click on pane',
    control: { type: 'number', min: 0, max: 20, step: 1 },
  },
  nodeClickDistance: {
    description: 'Distance mouse can move between mousedown/up to trigger click on node',
    control: { type: 'number', min: 0, max: 20, step: 1 },
  },

  // CSS Class Names
  noDragClassName: {
    description: 'Class name to prevent dragging (React: noDragClassName, Svelte: noDragClass)',
    control: { type: 'text' },
  },
  noWheelClassName: {
    description: 'Class name to prevent wheel zoom (React: noWheelClassName, Svelte: noWheelClass)',
    control: { type: 'text' },
  },
  noPanClassName: {
    description: 'Class name to prevent panning (React: noPanClassName, Svelte: noPanClass)',
    control: { type: 'text' },
  },
  class: {
    description: 'CSS class for flow container (Svelte only)',
    control: { type: 'text' },
  },
  className: {
    description: 'CSS class for flow container (React only)',
    control: { type: 'text' },
  },
  style: {
    description: 'Inline styles for flow container (Svelte: string, React: CSSProperties)',
    control: { type: 'text' },
  },

  // Styling
  colorMode: {
    description: 'Color scheme for the flow',
    options: ['light', 'dark', 'system'],
    control: { type: 'radio' },
  },
  colorModeSSR: {
    description: 'Fallback color mode for SSR when colorMode is system (Svelte only)',
    options: ['light', 'dark'],
    control: { type: 'radio' },
  },
  defaultMarkerColor: {
    description: 'Default color for edge markers. Use null for CSS variable',
    control: { type: 'text' },
  },

  // Performance
  onlyRenderVisibleElements: {
    description: 'Only render nodes/edges visible in viewport',
    control: { type: 'boolean' },
  },

  // Dimensions
  width: {
    description: 'Fixed width for the flow',
    control: { type: 'number', min: 100, max: 2000, step: 50 },
  },
  height: {
    description: 'Fixed height for the flow',
    control: { type: 'number', min: 100, max: 2000, step: 50 },
  },

  // Accessibility
  disableKeyboardA11y: {
    description: 'Disable keyboard accessibility features',
    control: { type: 'boolean' },
  },
  ariaLabelConfig: {
    description: 'Configuration for ARIA labels and accessibility text',
    control: { type: 'object' },
  },

  // Attribution
  attributionPosition: {
    description: 'Position of attribution',
    options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    control: { type: 'select' },
  },
  proOptions: {
    description: 'Pro subscription options',
    control: { type: 'object' },
  },

  // Other
  id: {
    description: 'ID of the flow - necessary for multiple flows (Svelte only)',
    control: { type: 'text' },
  },
  debug: {
    description: 'Enable debug logging to console (React only)',
    control: { type: 'boolean' },
  },
} as const;

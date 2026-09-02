import {
  ConnectionLineType,
  ConnectionMode,
  MarkerType,
  PanOnScrollMode,
  SelectionMode,
  type ColorMode,
  type DefaultEdgeOptions,
  type NodeOrigin,
  type PanelPosition,
  type ProOptions,
  type SnapGrid,
  type Viewport,
  type ZIndexMode,
} from '@xyflow/svelte';

export const API_DOCS_URL = 'https://svelteflow.dev/api-reference/svelte-flow';

export const baseNodes = [
  { id: '1', type: 'input', data: { label: 'Input' }, position: { x: 250, y: 0 } },
  { id: '2', data: { label: 'Default' }, position: { x: 100, y: 120 } },
  { id: '3', data: { label: 'Output' }, position: { x: 400, y: 120 }, type: 'output' },
  { id: '4', data: { label: 'Group parent' }, position: { x: 100, y: 260 }, style: 'width: 180px; height: 120px' },
  { id: '5', parentId: '4', data: { label: 'Child' }, position: { x: 20, y: 40 } },
] as const;

export const baseEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
] as const;

export type StoryMetaArgs = {
  useControlledViewport?: boolean;
};

export type SvelteFlowStoryArgs = StoryMetaArgs & {
  width?: number;
  height?: number;
  paneClickDistance?: number;
  nodeClickDistance?: number;
  nodeOrigin?: NodeOrigin;
  nodeDragThreshold?: number;
  connectionDragThreshold?: number;
  forceColorMode?: ColorMode;
  autoPanOnNodeFocus?: boolean;
  proOptions?: ProOptions;
  ariaLabelConfig?: Record<string, string>;
  initialViewport?: Viewport;
  viewport?: Viewport;
  fitView?: boolean;
  fitViewOptions?: Record<string, unknown>;
  minZoom?: number;
  maxZoom?: number;
  snapGrid?: SnapGrid;
  onlyRenderVisibleElements?: boolean;
  translateExtent?: [[number, number], [number, number]];
  nodeExtent?: [[number, number], [number, number]];
  preventScrolling?: boolean;
  attributionPosition?: PanelPosition;
  elevateEdgesOnSelect?: boolean;
  defaultMarkerColor?: string | null;
  defaultEdgeOptions?: DefaultEdgeOptions;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  nodesFocusable?: boolean;
  edgesFocusable?: boolean;
  elementsSelectable?: boolean;
  autoPanOnConnect?: boolean;
  autoPanOnNodeDrag?: boolean;
  autoPanOnSelection?: boolean;
  autoPanSpeed?: number;
  panOnDrag?: boolean | number[];
  selectionOnDrag?: boolean;
  selectionMode?: SelectionMode;
  panOnScroll?: boolean;
  panOnScrollSpeed?: number;
  panOnScrollMode?: PanOnScrollMode;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  zoomOnDoubleClick?: boolean;
  selectNodesOnDrag?: boolean;
  elevateNodesOnSelect?: boolean;
  clickConnect?: boolean;
  connectionMode?: ConnectionMode;
  zIndexMode?: ZIndexMode;
  connectionLineStyle?: string;
  connectionLineType?: ConnectionLineType;
  connectionRadius?: number;
  connectionLineContainerStyle?: string;
  deleteKey?: string | null;
  selectionKey?: string | null;
  multiSelectionKey?: string | null;
  zoomActivationKey?: string | null;
  panActivationKey?: string | null;
  disableKeyboardA11y?: boolean;
  noPanClass?: string;
  noDragClass?: string;
  noWheelClass?: string;
};

export const defaultStoryMeta: StoryMetaArgs = {
  useControlledViewport: false,
};

export const defaultFlowArgs: SvelteFlowStoryArgs = {
  ...defaultStoryMeta,
  fitView: true,
  minZoom: 0.5,
  maxZoom: 2,
  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,
  panOnDrag: true,
  zoomOnScroll: true,
  zIndexMode: 'basic',
};

export const PROP_SECTIONS = {
  common: [
    'width',
    'height',
    'paneClickDistance',
    'nodeClickDistance',
    'nodeOrigin',
    'nodeDragThreshold',
    'connectionDragThreshold',
    'forceColorMode',
    'autoPanOnNodeFocus',
    'proOptions',
    'ariaLabelConfig',
  ],
  viewport: [
    'initialViewport',
    'useControlledViewport',
    'viewport',
    'fitView',
    'fitViewOptions',
    'minZoom',
    'maxZoom',
    'snapGrid',
    'onlyRenderVisibleElements',
    'translateExtent',
    'nodeExtent',
    'preventScrolling',
    'attributionPosition',
  ],
  edge: ['elevateEdgesOnSelect', 'defaultMarkerColor', 'defaultEdgeOptions', 'edgesFocusable'],
  interaction: [
    'nodesDraggable',
    'nodesConnectable',
    'nodesFocusable',
    'edgesFocusable',
    'elementsSelectable',
    'autoPanOnConnect',
    'autoPanOnNodeDrag',
    'autoPanOnSelection',
    'autoPanSpeed',
    'panOnDrag',
    'selectionOnDrag',
    'selectionMode',
    'panOnScroll',
    'panOnScrollSpeed',
    'panOnScrollMode',
    'zoomOnScroll',
    'zoomOnPinch',
    'zoomOnDoubleClick',
    'selectNodesOnDrag',
    'elevateNodesOnSelect',
    'clickConnect',
    'connectionMode',
    'zIndexMode',
  ],
  connectionLine: ['connectionLineStyle', 'connectionLineType', 'connectionRadius', 'connectionLineContainerStyle'],
  keyboard: [
    'deleteKey',
    'selectionKey',
    'multiSelectionKey',
    'zoomActivationKey',
    'panActivationKey',
    'disableKeyboardA11y',
  ],
  style: ['noPanClass', 'noDragClass', 'noWheelClass'],
  eventHandlers: ['nodesDraggable', 'nodesConnectable', 'elementsSelectable', 'selectionOnDrag', 'clickConnect'],
} as const;

export type PropSection = keyof typeof PROP_SECTIONS;

export const SECTION_DESCRIPTIONS: Record<PropSection, string> = {
  common:
    'Props you will most commonly use when working with Svelte Flow — sizing, click distances, origins, and debugging.',
  viewport: 'Control the initial and ongoing position and zoom of the viewport, plus pan/zoom boundaries.',
  edge: 'Defaults and behavior for edges, including markers and selection elevation.',
  interaction: 'How users interact with the canvas — dragging, selecting, connecting, panning, and zooming.',
  connectionLine: 'Appearance and behavior of the temporary connection line while dragging a new edge.',
  keyboard: 'Keyboard shortcuts for delete, selection, pan, zoom, and accessibility.',
  style: 'Class names that change how interactions are handled on elements inside the canvas.',
  eventHandlers:
    'Event handlers are passed as Storybook actions (fn) and logged in the Actions panel. Interact with the flow to see events fire.',
};

export const SECTION_DEFAULTS: Record<PropSection, Partial<SvelteFlowStoryArgs>> = {
  common: {
    paneClickDistance: 0,
    nodeClickDistance: 0,
    nodeOrigin: [0, 0],
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    autoPanOnNodeFocus: true,
    proOptions: { hideAttribution: false },
    ariaLabelConfig: {
      'node.a11yDescription.default': 'Press enter or space to select a node',
    },
  },
  viewport: {
    initialViewport: { x: 0, y: 0, zoom: 1 },
    fitView: true,
    fitViewOptions: { padding: 0.2 },
    minZoom: 0.25,
    maxZoom: 4,
    snapGrid: [15, 15],
    onlyRenderVisibleElements: false,
    translateExtent: [
      [-1000, -1000],
      [1000, 1000],
    ],
    nodeExtent: [
      [-200, -200],
      [800, 600],
    ],
    preventScrolling: true,
    attributionPosition: 'bottom-right',
  },
  edge: {
    elevateEdgesOnSelect: true,
    defaultMarkerColor: '#6366f1',
    defaultEdgeOptions: {
      type: 'smoothstep',
      animated: false,
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    edgesFocusable: true,
  },
  interaction: {
    nodesDraggable: true,
    nodesConnectable: true,
    nodesFocusable: true,
    edgesFocusable: true,
    elementsSelectable: true,
    autoPanOnConnect: true,
    autoPanOnNodeDrag: true,
    autoPanOnSelection: true,
    autoPanSpeed: 15,
    panOnDrag: true,
    selectionOnDrag: false,
    selectionMode: SelectionMode.Full,
    panOnScroll: false,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: PanOnScrollMode.Free,
    zoomOnScroll: true,
    zoomOnPinch: true,
    zoomOnDoubleClick: true,
    selectNodesOnDrag: true,
    elevateNodesOnSelect: true,
    clickConnect: true,
    connectionMode: ConnectionMode.Strict,
    zIndexMode: 'auto',
  },
  connectionLine: {
    connectionLineType: ConnectionLineType.SmoothStep,
    connectionRadius: 24,
    connectionLineStyle: 'stroke: #6366f1; stroke-width: 2',
    connectionLineContainerStyle: 'z-index: 10',
  },
  keyboard: {
    deleteKey: 'Backspace',
    selectionKey: 'Shift',
    multiSelectionKey: 'Meta',
    zoomActivationKey: 'Meta',
    panActivationKey: 'Space',
    disableKeyboardA11y: false,
  },
  style: {
    noPanClass: 'nopan',
    noDragClass: 'nodrag',
    noWheelClass: 'nowheel',
  },
  eventHandlers: {
    nodesDraggable: true,
    nodesConnectable: true,
    elementsSelectable: true,
    selectionOnDrag: true,
    clickConnect: true,
  },
};

type ArgTypeConfig = {
  control?:
    | 'boolean'
    | 'text'
    | 'color'
    | 'select'
    | 'object'
    | 'number'
    | { type: string; min?: number; max?: number; step?: number };
  description: string;
  options?: unknown[];
  table?: { category?: string; defaultValue?: { summary?: string } };
};

export const svelteFlowArgTypes: Record<string, ArgTypeConfig> = {
  useControlledViewport: {
    control: 'boolean',
    description: 'Use controlled viewport via bind:viewport (story helper).',
    table: { category: 'Story' },
  },
  width: { control: 'number', description: 'Sets a fixed width for the flow.' },
  height: { control: 'number', description: 'Sets a fixed height for the flow.' },
  paneClickDistance: {
    control: 'number',
    description: 'Distance the mouse can move between mousedown/up to trigger a pane click.',
    table: { defaultValue: { summary: '0' } },
  },
  nodeClickDistance: {
    control: 'number',
    description: 'Distance the mouse can move between mousedown/up to trigger a node click.',
    table: { defaultValue: { summary: '0' } },
  },
  nodeOrigin: {
    control: 'object',
    description: 'Origin used when placing nodes. [0,0] is top-left, [0.5,0.5] is center.',
    table: { defaultValue: { summary: '[0, 0]' } },
  },
  nodeDragThreshold: {
    control: 'number',
    description: 'Pixels to drag before a node drag event fires.',
    table: { defaultValue: { summary: '1' } },
  },
  connectionDragThreshold: {
    control: 'number',
    description: 'Pixels the mouse must move before a connection line starts dragging.',
    table: { defaultValue: { summary: '1' } },
  },
  forceColorMode: {
    control: 'select',
    options: ['light', 'dark', 'system'],
    description: 'Forces a color scheme on the flow container.',
    table: { defaultValue: { summary: 'undefined' } },
  },
  autoPanOnNodeFocus: {
    control: 'boolean',
    description: 'Pan the viewport when a node is focused.',
    table: { defaultValue: { summary: 'true' } },
  },
  proOptions: { control: 'object', description: 'Pro options including hideAttribution.' },
  ariaLabelConfig: { control: 'object', description: 'Customizable ARIA labels and UI text.' },
  initialViewport: {
    control: 'object',
    description: 'Initial viewport position and zoom.',
    table: { defaultValue: { summary: '{ x: 0, y: 0, zoom: 1 }' } },
  },
  viewport: { control: 'object', description: 'Controlled viewport — use with useControlledViewport.' },
  fitView: { control: 'boolean', description: 'Zoom and pan to fit all nodes on mount.' },
  fitViewOptions: { control: 'object', description: 'Options for the initial fitView call.' },
  minZoom: {
    control: { type: 'number', min: 0.1, max: 4, step: 0.1 },
    description: 'Minimum zoom level.',
    table: { defaultValue: { summary: '0.5' } },
  },
  maxZoom: {
    control: { type: 'number', min: 0.5, max: 8, step: 0.1 },
    description: 'Maximum zoom level.',
    table: { defaultValue: { summary: '2' } },
  },
  snapGrid: { control: 'object', description: 'Grid size nodes snap to when dragged.' },
  onlyRenderVisibleElements: {
    control: 'boolean',
    description: 'Only render nodes and edges visible in the viewport.',
    table: { defaultValue: { summary: 'false' } },
  },
  translateExtent: { control: 'object', description: 'Boundary for viewport panning.' },
  nodeExtent: { control: 'object', description: 'Boundary where nodes can be placed.' },
  preventScrolling: {
    control: 'boolean',
    description: 'Prevent page scroll when pointer is over the flow.',
    table: { defaultValue: { summary: 'true' } },
  },
  attributionPosition: {
    control: 'select',
    options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    description: 'Position of the Svelte Flow attribution.',
    table: { defaultValue: { summary: 'bottom-right' } },
  },
  elevateEdgesOnSelect: {
    control: 'boolean',
    description: 'Raise z-index of edges when selected.',
    table: { defaultValue: { summary: 'true' } },
  },
  defaultMarkerColor: {
    control: 'color',
    description: 'Color of edge markers. Pass null to use --xy-edge-stroke.',
    table: { defaultValue: { summary: '#b1b1b7' } },
  },
  defaultEdgeOptions: { control: 'object', description: 'Defaults applied to all new edges.' },
  nodesDraggable: {
    control: 'boolean',
    description: 'Whether nodes are draggable.',
    table: { defaultValue: { summary: 'true' } },
  },
  nodesConnectable: {
    control: 'boolean',
    description: 'Whether nodes are connectable.',
    table: { defaultValue: { summary: 'true' } },
  },
  nodesFocusable: {
    control: 'boolean',
    description: 'Whether nodes are focusable via keyboard.',
    table: { defaultValue: { summary: 'true' } },
  },
  edgesFocusable: {
    control: 'boolean',
    description: 'Whether edges are focusable via keyboard.',
    table: { defaultValue: { summary: 'true' } },
  },
  elementsSelectable: {
    control: 'boolean',
    description: 'Whether elements can be selected.',
    table: { defaultValue: { summary: 'true' } },
  },
  autoPanOnConnect: {
    control: 'boolean',
    description: 'Auto-pan while creating a connection.',
    table: { defaultValue: { summary: 'true' } },
  },
  autoPanOnNodeDrag: {
    control: 'boolean',
    description: 'Auto-pan while dragging a node.',
    table: { defaultValue: { summary: 'true' } },
  },
  autoPanOnSelection: {
    control: 'boolean',
    description: 'Auto-pan while dragging a selection box.',
    table: { defaultValue: { summary: 'true' } },
  },
  autoPanSpeed: { control: 'number', description: 'Speed of auto-pan.', table: { defaultValue: { summary: '15' } } },
  panOnDrag: {
    control: 'object',
    description: 'Pan by click-drag. true, false, or mouse button array e.g. [0, 2].',
    table: { defaultValue: { summary: 'true' } },
  },
  selectionOnDrag: {
    control: 'boolean',
    description: 'Select with a box without holding selectionKey.',
    table: { defaultValue: { summary: 'false' } },
  },
  selectionMode: {
    control: 'select',
    options: [SelectionMode.Full, SelectionMode.Partial],
    description: 'Full selects only fully enclosed nodes; partial includes partially enclosed.',
    table: { defaultValue: { summary: 'full' } },
  },
  panOnScroll: { control: 'boolean', description: 'Pan viewport on scroll.', table: { defaultValue: { summary: 'false' } } },
  panOnScrollSpeed: { control: 'number', description: 'Pan speed on scroll.', table: { defaultValue: { summary: '0.5' } } },
  panOnScrollMode: {
    control: 'select',
    options: [PanOnScrollMode.Free, PanOnScrollMode.Vertical, PanOnScrollMode.Horizontal],
    description: 'Direction limit when panOnScroll is enabled.',
    table: { defaultValue: { summary: 'free' } },
  },
  zoomOnScroll: { control: 'boolean', description: 'Zoom viewport on scroll.', table: { defaultValue: { summary: 'true' } } },
  zoomOnPinch: { control: 'boolean', description: 'Zoom viewport on pinch.', table: { defaultValue: { summary: 'true' } } },
  zoomOnDoubleClick: {
    control: 'boolean',
    description: 'Zoom viewport on double-click.',
    table: { defaultValue: { summary: 'true' } },
  },
  selectNodesOnDrag: {
    control: 'boolean',
    description: 'Select nodes when dragging them.',
    table: { defaultValue: { summary: 'true' } },
  },
  elevateNodesOnSelect: {
    control: 'boolean',
    description: 'Raise z-index of selected nodes.',
    table: { defaultValue: { summary: 'true' } },
  },
  clickConnect: {
    control: 'boolean',
    description: 'Click source then target handle to connect.',
    table: { defaultValue: { summary: 'true' } },
  },
  connectionMode: {
    control: 'select',
    options: [ConnectionMode.Strict, ConnectionMode.Loose],
    description: 'Strict: source→target only. Loose: allows source→source.',
    table: { defaultValue: { summary: 'strict' } },
  },
  zIndexMode: {
    control: 'select',
    options: ['auto', 'basic', 'manual'] satisfies ZIndexMode[],
    description: 'How z-index is calculated for nodes and edges.',
    table: { defaultValue: { summary: 'basic' } },
  },
  connectionLineStyle: { control: 'text', description: 'Styles for the connection line.' },
  connectionLineType: {
    control: 'select',
    options: [
      ConnectionLineType.Bezier,
      ConnectionLineType.Straight,
      ConnectionLineType.Step,
      ConnectionLineType.SmoothStep,
      ConnectionLineType.SimpleBezier,
    ],
    description: 'Edge path type for the connection line.',
    table: { defaultValue: { summary: 'Bezier' } },
  },
  connectionRadius: {
    control: 'number',
    description: 'Radius around a handle to drop a connection line.',
    table: { defaultValue: { summary: '20' } },
  },
  connectionLineContainerStyle: { control: 'text', description: 'Styles for the connection line container.' },
  deleteKey: {
    control: 'text',
    description: 'Key to delete selected elements. Pass null to disable.',
    table: { defaultValue: { summary: 'Backspace' } },
  },
  selectionKey: {
    control: 'text',
    description: 'Key to draw a selection box. Pass null to disable.',
    table: { defaultValue: { summary: 'Shift' } },
  },
  multiSelectionKey: {
    control: 'text',
    description: 'Key to multi-select by clicking. Pass null to disable.',
    table: { defaultValue: { summary: 'Meta' } },
  },
  zoomActivationKey: {
    control: 'text',
    description: 'Key to zoom on scroll when panOnScroll is false. Pass null to disable.',
    table: { defaultValue: { summary: 'Meta' } },
  },
  panActivationKey: {
    control: 'text',
    description: 'Key to pan on scroll when panOnScroll is false. Pass null to disable.',
    table: { defaultValue: { summary: 'Space' } },
  },
  disableKeyboardA11y: {
    control: 'boolean',
    description: 'Disable keyboard accessibility (arrow keys, etc.).',
    table: { defaultValue: { summary: 'false' } },
  },
  noPanClass: {
    control: 'text',
    description: 'Class that prevents panning when dragging an element.',
    table: { defaultValue: { summary: 'nopan' } },
  },
  noDragClass: {
    control: 'text',
    description: 'Class that prevents dragging a node.',
    table: { defaultValue: { summary: 'nodrag' } },
  },
  noWheelClass: {
    control: 'text',
    description: 'Class that prevents zoom on wheel.',
    table: { defaultValue: { summary: 'nowheel' } },
  },
};

export function sectionArgs(section: PropSection): SvelteFlowStoryArgs {
  return {
    ...defaultFlowArgs,
    ...SECTION_DEFAULTS[section],
  };
}

export function sectionControls(section: PropSection): string[] {
  return [...PROP_SECTIONS[section]];
}

export const SECTION_DOC_ANCHORS: Record<PropSection, string> = {
  common: '#common-props',
  viewport: '#viewport-props',
  edge: '#edge-props',
  interaction: '#interaction-props',
  connectionLine: '#connection-line-props',
  keyboard: '#keyboard-props',
  style: '#style-props',
  eventHandlers: '#event-handlers',
};

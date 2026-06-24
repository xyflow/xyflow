import type { Edge, FlowProps, Node, State } from '../types';
import { ConnectionLineType, ConnectionMode, isMacOs, mergeAriaLabelConfig, PanOnScrollMode, SelectionMode } from '@xyflow/system';

import { createHooks } from './hooks';

export function useState<NodeType extends Node = Node, EdgeType extends Edge = Edge>(): State<NodeType, EdgeType> {
  return {
    vueFlowRef: null,
    viewportRef: null,
    nodes: [],
    edges: [],
    nodeLookup: new Map(),
    parentLookup: new Map(),
    edgeLookup: new Map(),
    connectionLookup: new Map(),
    nodeTypes: {},
    edgeTypes: {},

    initialized: false,

    dimensions: {
      width: 0,
      height: 0,
    },
    transform: [0, 0, 1],

    panZoom: null,

    minZoom: 0.5,
    maxZoom: 2,

    translateExtent: [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
    ],
    nodeExtent: [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
    ],
    nodeOrigin: [0, 0],

    selectionMode: SelectionMode.Full,
    paneDragging: false,
    preventScrolling: true,
    zoomOnScroll: true,
    zoomOnPinch: true,
    zoomOnDoubleClick: true,
    panOnScroll: false,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: PanOnScrollMode.Free,
    paneClickDistance: 0,
    nodeClickDistance: 0,
    panOnDrag: true,
    reconnectRadius: 10,
    onlyRenderVisibleElements: false,
    defaultViewport: { x: 0, y: 0, zoom: 1 },

    nodesSelectionActive: false,
    userSelectionActive: false,

    userSelectionRect: null,

    defaultMarkerColor: '#b1b1b7',
    connectionLineOptions: {
      type: ConnectionLineType.Bezier,
      style: {},
    },
    connectionMode: ConnectionMode.Strict,
    connectionStartHandle: null,
    connectionEndHandle: null,
    connectionClickStartHandle: null,
    connectionPosition: { x: Number.NaN, y: Number.NaN },
    connectionRadius: 20,
    connectionDragThreshold: 1,
    connectOnClick: true,
    connectionStatus: null,
    isValidConnection: null,
    onBeforeDelete: null,

    snapGrid: [15, 15],
    snapToGrid: false,

    edgesReconnectable: false,
    edgesFocusable: true,
    nodesFocusable: true,
    nodesConnectable: true,
    nodesDraggable: true,
    nodeDragThreshold: 1,
    elementsSelectable: true,
    selectNodesOnDrag: true,
    multiSelectionActive: false,
    selectionKeyCode: 'Shift',
    selectionOnDrag: false,
    multiSelectionKeyCode: isMacOs() ? 'Meta' : 'Control',
    zoomActivationKeyCode: isMacOs() ? 'Meta' : 'Control',
    deleteKeyCode: 'Backspace',
    panActivationKeyCode: 'Space',

    hooks: createHooks(),

    autoApplyChanges: true,
    autoConnect: false,

    fitViewOnInit: false,
    fitViewOnInitDone: false,

    noDragClassName: 'nodrag',
    noWheelClassName: 'nowheel',
    noPanClassName: 'nopan',
    defaultEdgeOptions: undefined,
    elevateEdgesOnSelect: false,
    elevateNodesOnSelect: true,
    zIndexMode: 'basic',

    autoPanOnNodeDrag: true,
    autoPanOnConnect: true,
    autoPanOnNodeFocus: true,
    autoPanOnSelection: true,
    autoPanSpeed: 15,

    disableKeyboardA11y: false,
    ariaLabelConfig: mergeAriaLabelConfig(),
    ariaLiveMessage: '',
  };
}

// these options will be set using the appropriate methods
export const storeOptionsToSkip: (keyof Partial<FlowProps & Omit<State, 'nodes' | 'edges'>>)[] = [
  'id',
  'vueFlowRef',
  'viewportRef',
  'initialized',
  'nodes',
  'edges',
  'maxZoom',
  'minZoom',
  'translateExtent',
  'nodeExtent',
  'fitView',
  // mapped from the `fitView` prop in `setState`; keep the generic option loop from re-applying the
  // default — the full state is spread into `setState` on store creation, so a stale `fitViewOnInit: false`
  // would otherwise clobber the value `fitView` just set, leaving `:fit-view` inert.
  'fitViewOnInit',
  'viewport',
  'hooks',
  'defaultEdgeOptions',
];

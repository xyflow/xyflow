import type { Meta, StoryObj } from '@storybook/react-vite';
import CommonProps from './CommonProps';
import { ConnectionLineType } from '@xyflow/react';

const meta: Meta<typeof CommonProps> = {
  title: 'React Flow/ReactFlow/CommonProps',
  component: CommonProps,
  parameters: { renderer: 'react' },
  args: {
    // Common data props
    nodes: [
      { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 100, y: 50 } },
      { id: '2', data: { label: 'Node 2' }, position: { x: 300, y: 150 } },
    ],
    edges: [],
    defaultNodes: [],
    defaultEdges: [{ id: 'e1-2', source: '1', target: '2' }],
    defaultEdgeOptions: undefined,
    nodeTypes: undefined,
    edgeTypes: undefined,

    // Event handlers omitted in controls; defaults are undefined

    // Viewport props
    paneClickDistance: 0,
    nodeClickDistance: 0,
    minZoom: 0.5,
    maxZoom: 2,
    defaultViewport: { x: 0, y: 0, zoom: 1 },
    translateExtent: undefined,
    preventScrolling: true,
    zoomOnScroll: true,
    zoomOnPinch: true,
    panOnScroll: false,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: 'free',
    zoomOnDoubleClick: true,

    // Edge and connection props
    connectionLineType: ConnectionLineType.Bezier,
    connectionMode: 'strict',
    reconnectRadius: 10,
    defaultMarkerColor: '#b1b1b7',
    connectionRadius: 20,
    connectOnClick: true,

    // Interaction props
    onlyRenderVisibleElements: false,
    nodesDraggable: true,
    autoPanOnNodeFocus: true,
    nodesConnectable: true,
    nodesFocusable: true,
    nodeOrigin: [0, 0],
    edgesFocusable: true,
    edgesReconnectable: true,
    elementsSelectable: true,
    selectNodesOnDrag: true,
    panOnDrag: true,
    fitView: false,

    // Keyboard props
    deleteKeyCode: 'Backspace',
    selectionKeyCode: 'Shift',
    selectionOnDrag: false,
    selectionMode: 'full',
    panActivationKeyCode: 'Space',
    // multiSelectionKeyCode and zoomActivationKeyCode are platform-dependent defaults
    // We set to 'Meta' to reflect macOS default for Storybook env
    multiSelectionKeyCode: 'Meta',
    zoomActivationKeyCode: 'Meta',

    // Style props
    noDragClassName: 'nodrag',
    noWheelClassName: 'nowheel',
    noPanClassName: 'nopan',

    // Grid snapping
    snapToGrid: false,
    snapGrid: undefined,

    // Pro and elevating props
    attributionPosition: 'bottom-right',
    proOptions: undefined,
    elevateNodesOnSelect: true,
    elevateEdgesOnSelect: false,

    // A11y and autopan
    disableKeyboardA11y: false,
    autoPanOnNodeDrag: true,
    autoPanOnConnect: true,
    autoPanSpeed: 15,

    // Thresholds and sizes
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    width: undefined,
    height: undefined,

    // Color and debug
    colorMode: 'light',
    debug: false,

    // ARIA labels
    ariaLabelConfig: undefined,
  },
  argTypes: {
    // Large number of callback props are not useful as controls
    onNodeClick: { table: { disable: true } },
    onNodeDoubleClick: { table: { disable: true } },
    onNodeMouseEnter: { table: { disable: true } },
    onNodeMouseMove: { table: { disable: true } },
    onNodeMouseLeave: { table: { disable: true } },
    onNodeContextMenu: { table: { disable: true } },
    onNodeDragStart: { table: { disable: true } },
    onNodeDrag: { table: { disable: true } },
    onNodeDragStop: { table: { disable: true } },
    onEdgeClick: { table: { disable: true } },
    onEdgeContextMenu: { table: { disable: true } },
    onEdgeMouseEnter: { table: { disable: true } },
    onEdgeMouseMove: { table: { disable: true } },
    onEdgeMouseLeave: { table: { disable: true } },
    onEdgeDoubleClick: { table: { disable: true } },
    onReconnect: { table: { disable: true } },
    onReconnectStart: { table: { disable: true } },
    onReconnectEnd: { table: { disable: true } },
    onNodesChange: { table: { disable: true } },
    onEdgesChange: { table: { disable: true } },
    onNodesDelete: { table: { disable: true } },
    onEdgesDelete: { table: { disable: true } },
    onDelete: { table: { disable: true } },
    onSelectionDragStart: { table: { disable: true } },
    onSelectionDrag: { table: { disable: true } },
    onSelectionDragStop: { table: { disable: true } },
    onSelectionStart: { table: { disable: true } },
    onSelectionEnd: { table: { disable: true } },
    onSelectionContextMenu: { table: { disable: true } },
    onConnect: { table: { disable: true } },
    onConnectStart: { table: { disable: true } },
    onConnectEnd: { table: { disable: true } },
    onClickConnectStart: { table: { disable: true } },
    onClickConnectEnd: { table: { disable: true } },
    onInit: { table: { disable: true } },
    onMove: { table: { disable: true } },
    onMoveStart: { table: { disable: true } },
    onMoveEnd: { table: { disable: true } },
    // onSelectionChange: { table: { disable: true } },
    onPaneScroll: { table: { disable: true } },
    onPaneClick: { table: { disable: true } },
    onPaneContextMenu: { table: { disable: true } },
    onPaneMouseEnter: { table: { disable: true } },
    onPaneMouseMove: { table: { disable: true } },
    onPaneMouseLeave: { table: { disable: true } },
    onViewportChange: { table: { disable: true } },
    onBeforeDelete: { table: { disable: true } },
    onError: { table: { disable: true } },
    isValidConnection: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

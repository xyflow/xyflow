import { devWarn, infiniteExtent, ConnectionMode, updateNodes } from '@xyflow/system';

import type { Edge, Node, ReactFlowStore } from '../types';

const getInitialState = ({ nodes = [], edges = [] }: { nodes?: Node[]; edges?: Edge[] }): ReactFlowStore => {
  const nextNodes = updateNodes(nodes, [], { nodeOrigin: [0, 0], elevateNodesOnSelect: false });

  return {
    rfId: '1',
    width: 0,
    height: 0,
    transform: [0, 0, 1],
    nodes: nextNodes,
    edges: edges,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: false,
    hasDefaultEdges: false,
    panZoom: null,
    minZoom: 0.5,
    maxZoom: 2,
    translateExtent: infiniteExtent,
    nodeExtent: infiniteExtent,
    nodesSelectionActive: false,
    userSelectionActive: false,
    userSelectionRect: null,
    connectionPosition: { x: 0, y: 0 },
    connectionStatus: null,
    connectionMode: ConnectionMode.Strict,
    domNode: null,
    paneDragging: false,
    noPanClassName: 'nopan',
    nodeOrigin: [0, 0],
    nodeDragThreshold: 0,

    snapGrid: [15, 15],
    snapToGrid: false,

    nodesDraggable: true,
    nodesConnectable: true,
    nodesFocusable: true,
    edgesFocusable: true,
    edgesUpdatable: true,
    elementsSelectable: true,
    elevateNodesOnSelect: true,
    fitViewOnInit: false,
    fitViewDone: false,
    fitViewOnInitOptions: undefined,
    selectNodesOnDrag: true,

    multiSelectionActive: false,

    connectionStartHandle: null,
    connectionEndHandle: null,
    connectionClickStartHandle: null,
    connectOnClick: true,

    ariaLiveMessage: '',
    autoPanOnConnect: true,
    autoPanOnNodeDrag: true,
    connectionRadius: 20,
    onError: devWarn,
    isValidConnection: undefined,

    lib: 'react',
  };
};

export default getInitialState;

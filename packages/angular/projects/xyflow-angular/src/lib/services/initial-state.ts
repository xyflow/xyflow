import {
  Viewport,
  NodeOrigin,
  CoordinateExtent,
  Transform,
  ConnectionState,
  initialConnection,
} from '@xyflow/system';

export function getInitialState() {
  return {
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 } as Viewport,
    transform: [0, 0, 1] as Transform,
    nodeOrigin: [0, 0] as NodeOrigin,
    nodeExtent: [[-Infinity, -Infinity], [Infinity, Infinity]] as CoordinateExtent,
    translateExtent: [[-Infinity, -Infinity], [Infinity, Infinity]] as CoordinateExtent,
    minZoom: 0.5,
    maxZoom: 2,
    elementsSelectable: true,
    nodesDraggable: true,
    nodesConnectable: true,
    nodeTypes: {},
    edgeTypes: {},
    connection: initialConnection as ConnectionState,
    width: 0,
    height: 0,
    fitViewQueued: false,
    fitViewOptions: undefined,
    fitViewResolver: null,
  };
}
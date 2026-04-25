import type { FlowConfig } from '../types';

type EventRecord = {
  type: string;
  id?: string;
  nodes?: string[];
  edges?: string[];
};

declare global {
  interface Window {
    __emberFlowEvents?: EventRecord[];
  }
}

function record(event: EventRecord) {
  window.__emberFlowEvents = [...(window.__emberFlowEvents ?? []), event];
}

export default {
  flowProps: {
    fitView: false,
    initialViewport: { x: 0, y: 0, zoom: 1 },
    nodeDragThreshold: 0,
    autoPanOnConnect: false,
    autoPanOnNodeDrag: false,
    deleteKey: 'd',
    onInit: (flow) => record({ type: 'init', id: `${flow.getNodes().length}:${flow.getEdges().length}` }),
    onViewportChangeStart: (viewport) => record({ type: 'viewport-start', id: `${viewport.zoom}` }),
    onViewportChange: (viewport) => record({ type: 'viewport-change', id: `${viewport.zoom}` }),
    onViewportChangeEnd: (viewport) => record({ type: 'viewport-end', id: `${viewport.zoom}` }),
    onBeforeDelete: ({ nodes, edges }) => {
      record({
        type: 'before-delete',
        nodes: nodes.map((node) => node.id),
        edges: edges.map((edge) => edge.id),
      });
      return true;
    },
    onNodesDelete: (nodes) => record({ type: 'nodes-delete', nodes: nodes.map((node) => node.id) }),
    onEdgesDelete: (edges) => record({ type: 'edges-delete', edges: edges.map((edge) => edge.id) }),
    onDelete: ({ nodes, edges }) =>
      record({
        type: 'delete',
        nodes: nodes.map((node) => node.id),
        edges: edges.map((edge) => edge.id),
      }),
    onNodeClick: (_event, node) => record({ type: 'node-click', id: node.id }),
    onEdgeClick: (_event, edge) => record({ type: 'edge-click', id: edge.id }),
    onPaneClick: () => record({ type: 'pane-click' }),
    onNodeDragStart: (_event, node) => record({ type: 'node-drag-start', id: node.id }),
    onNodeDrag: (_event, node) => record({ type: 'node-drag', id: node.id }),
    onNodeDragStop: (_event, node) => record({ type: 'node-drag-stop', id: node.id }),
    onConnectStart: (_event, params) => record({ type: 'connect-start', id: `${params.nodeId}:${params.handleType}` }),
    onConnect: (connection) => record({ type: 'connect', id: `${connection.source}->${connection.target}` }),
    onConnectEnd: () => record({ type: 'connect-end' }),
    isValidConnection: (connection) => {
      record({ type: 'valid-connection', id: `${connection.source}->${connection.target}` });
      return true;
    },
    onSelectionChange: ({ nodes, edges }) =>
      record({
        type: 'selection-change',
        nodes: nodes.map((node) => node.id),
        edges: edges.map((edge) => edge.id),
      }),
    nodes: [
      {
        id: 'event-a',
        data: { label: 'event-a' },
        position: { x: 100, y: 100 },
      },
      {
        id: 'event-b',
        data: { label: 'event-b' },
        position: { x: 360, y: 160 },
      },
    ],
    edges: [
      {
        id: 'event-edge',
        source: 'event-a',
        target: 'event-b',
        label: 'event-edge',
      },
    ],
  },
} satisfies FlowConfig;

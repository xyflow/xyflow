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
      return Promise.resolve(true);
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
    onNodeDoubleClick: (_event, node) => record({ type: 'node-double-click', id: node.id }),
    onNodeContextMenu: (_event, node) => record({ type: 'node-context-menu', id: node.id }),
    onEdgeClick: (_event, edge) => record({ type: 'edge-click', id: edge.id }),
    onEdgeDoubleClick: (_event, edge) => record({ type: 'edge-double-click', id: edge.id }),
    onEdgeContextMenu: (_event, edge) => record({ type: 'edge-context-menu', id: edge.id }),
    onEdgeMouseEnter: (_event, edge) => record({ type: 'edge-mouse-enter', id: edge.id }),
    onEdgeMouseMove: (_event, edge) => record({ type: 'edge-mouse-move', id: edge.id }),
    onEdgeMouseLeave: (_event, edge) => record({ type: 'edge-mouse-leave', id: edge.id }),
    onPaneClick: () => record({ type: 'pane-click' }),
    onPaneMouseEnter: () => record({ type: 'pane-mouse-enter' }),
    onPaneMouseMove: () => record({ type: 'pane-mouse-move' }),
    onPaneMouseLeave: () => record({ type: 'pane-mouse-leave' }),
    onPaneScroll: () => record({ type: 'pane-scroll' }),
    onPaneContextMenu: () => record({ type: 'pane-context-menu' }),
    onNodeDragStart: (_event, node) => record({ type: 'node-drag-start', id: node.id }),
    onNodeDrag: (_event, node) => record({ type: 'node-drag', id: node.id }),
    onNodeDragStop: (_event, node) => record({ type: 'node-drag-stop', id: node.id }),
    onSelectionDragStart: (_event, nodes) =>
      record({ type: 'selection-drag-start', nodes: nodes.map((node) => node.id) }),
    onSelectionDrag: (_event, nodes) => record({ type: 'selection-drag', nodes: nodes.map((node) => node.id) }),
    onSelectionDragStop: (_event, nodes) =>
      record({ type: 'selection-drag-stop', nodes: nodes.map((node) => node.id) }),
    onSelectionStart: () => record({ type: 'selection-start' }),
    onSelectionEnd: () => record({ type: 'selection-end' }),
    onSelectionContextMenu: (_event, nodes) =>
      record({ type: 'selection-context-menu', nodes: nodes.map((node) => node.id) }),
    onConnectStart: (_event, params) => record({ type: 'connect-start', id: `${params.nodeId}:${params.handleType}` }),
    onConnect: (connection) => record({ type: 'connect', id: `${connection.source}->${connection.target}` }),
    onConnectEnd: (_event, state) => {
      record({ type: 'connect-end' });
      record({ type: 'connect-end-state', id: `${state.isValid}:${state.toNode?.id ?? 'none'}` });
    },
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

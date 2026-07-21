import type { SharedFlowConfig, SharedNode } from 'storybook-shared/types';

export const paneGeneralConfig = {
  flowProps: {
    minZoom: 0.25,
    maxZoom: 4,
    fitView: true,
    nodes: [
      { id: '1', data: { label: '1' }, position: { x: 0, y: 0 }, type: 'input' },
      { id: '2', data: { label: '2' }, position: { x: -100, y: 100 } },
      { id: '3', data: { label: '3' }, position: { x: 100, y: 100 } },
    ],
    edges: [
      { id: 'first-edge', source: '1', target: '2' },
      { id: 'second-edge', source: '1', target: '3' },
    ],
  },
} satisfies SharedFlowConfig;

export const paneNonDefaultsSvelteConfig = {
  flowProps: {
    panOnScroll: true,
    fitView: false,
    initialViewport: { x: 1.23, y: 9.87, zoom: 1.234 },
    autoPanOnConnect: false,
    autoPanOnNodeDrag: false,
    nodes: paneGeneralConfig.flowProps.nodes,
    edges: paneGeneralConfig.flowProps.edges,
  },
} satisfies SharedFlowConfig;

const edgesGeneralNodes = [
  { id: '1', data: { label: '1' }, position: { x: 0, y: 0 }, type: 'input' },
  { id: '2', data: { label: '2' }, position: { x: -100, y: 100 } },
  { id: '3', data: { label: '3' }, position: { x: 100, y: 100 } },
  { id: '4', data: { label: '4' }, position: { x: -100, y: 200 } },
  { id: '5', data: { label: '5' }, position: { x: 100, y: 200 } },
  { id: '6', data: { label: '6' }, position: { x: -100, y: 300 } },
  { id: '7', data: { label: '7' }, position: { x: 100, y: 300 } },
  { id: '8', data: { label: '8' }, position: { x: -100, y: 400 } },
  { id: '9', data: { label: '9' }, position: { x: 100, y: 400 } },
  { id: '10', data: { label: '10' }, position: { x: -100, y: 500 } },
  { id: '11', data: { label: '11' }, position: { x: 100, y: 500 } },
  { id: '12', data: { label: '12' }, position: { x: 100, y: 600 }, width: 200, height: 100 },
  { id: '12-a', parentId: '12', data: { label: '12-a' }, position: { x: 10, y: 20 }, width: 50, height: 50 },
  { id: '12-b', parentId: '12', data: { label: '12-b' }, position: { x: 140, y: 20 }, width: 50, height: 50 },
];

const edgesGeneralEdges = [
  { id: 'edge-with-class', source: '1', target: '2', className: 'edge-class-test' },
  { id: 'edge-with-style', source: '1', target: '3', style: { stroke: 'red' } },
  { id: 'hidden-edge', source: '2', target: '4', label: 'hidden', hidden: true },
  { id: 'animated-edge', source: '3', target: '5', label: 'animated', animated: true },
  { id: 'not-selectable-edge', source: '4', target: '6', label: 'not-selectable', selectable: false },
  { id: 'not-deletable', source: '5', target: '7', label: 'not-deletable', deletable: false },
  { id: 'z-index', source: '6', target: '8', label: 'z-index', zIndex: 3141592 },
  { id: 'aria-label', source: '7', target: '9', label: 'aria-label', ariaLabel: 'aria-label-test' },
  { id: 'interaction-width', source: '8', target: '10', label: 'interaction-width', interactionWidth: 42 },
  {
    id: 'markers',
    source: '9',
    target: '11',
    label: 'markers',
    markerEnd: { type: 'arrow' },
    markerStart: { type: 'arrowclosed' },
  },
  { id: 'subflow-edge', source: '11', target: '12-a' },
  { id: 'subflow-edge-2', source: '12-a', target: '12-b' },
];

export const edgesGeneralSvelteConfig = {
  flowProps: {
    fitView: true,
    multiSelectionKey: ['Meta', 's'],
    deleteKey: 'd',
    nodes: edgesGeneralNodes,
    edges: edgesGeneralEdges.map((edge) => {
      const { className, style, ...rest } = edge as typeof edge & {
        className?: string;
        style?: Record<string, string>;
      };

      return {
        ...rest,
        ...(className ? { class: className } : {}),
        ...(style ? { style: `stroke: ${style.stroke ?? 'red'};` } : {}),
      };
    }),
  },
} satisfies SharedFlowConfig;

export const nodesGeneralNodes: SharedNode[] = [
  {
    id: 'Node-1',
    data: { label: 'Node-1' },
    position: { x: 0, y: 0 },
    type: 'input',
    className: 'playwright-test-class-123',
    style: { backgroundColor: 'red' },
  },
  { id: 'Node-2', type: 'output', data: { label: 'Node-2' }, position: { x: -100, y: 100 } },
  { id: 'Node-3', data: { label: 'Node-3' }, position: { x: 100, y: 100 } },
  { id: 'Node-4', data: { label: 'Node-4' }, position: { x: 0, y: 200 }, type: 'output' },
  {
    id: 'drag-handle',
    data: { label: 'Drag Handle' },
    position: { x: 200, y: 0 },
    type: 'DragHandleNode',
    dragHandle: '.custom-drag-handle',
  },
  {
    id: 'notConnectable',
    type: 'output',
    data: { label: 'notConnectable' },
    position: { x: 0, y: 300 },
    connectable: false,
  },
  { id: 'notDraggable', data: { label: 'notDraggable' }, position: { x: 0, y: 400 }, draggable: false },
  { id: 'notSelectable', data: { label: 'notSelectable' }, position: { x: 0, y: 500 }, selectable: false },
  { id: 'notDeletable', data: { label: 'notDeletable' }, position: { x: 0, y: 600 }, deletable: false },
  { id: 'hidden', data: { label: 'hidden' }, position: { x: 0, y: 700 }, hidden: true },
];

const nodesGeneralEdges = [
  { id: '1-2', type: 'default', source: 'Node-1', target: 'Node-2', label: 'edge' },
  { id: '1-3', type: 'default', source: 'Node-1', target: 'Node-3', label: 'edge' },
];

export const nodesGeneralSvelteConfig = {
  flowProps: {
    fitView: true,
    nodeDragThreshold: 0,
    autoPanOnConnect: false,
    autoPanOnNodeDrag: false,
    deleteKey: 'd',
    multiSelectionKey: ['Meta', 's'],
    selectionOnDrag: true,
    panOnDrag: false,
    nodes: nodesGeneralNodes.map((node) => {
      const { className, style, ...rest } = node;
      return {
        ...rest,
        ...(className ? { class: className } : {}),
        ...(style ? { style: `background-color: ${style.backgroundColor ?? 'red'};` } : {}),
      };
    }),
    edges: nodesGeneralEdges,
  },
} satisfies SharedFlowConfig;

const colorModeNodes = [
  { id: 'A', type: 'input', position: { x: 0, y: 150 }, data: { label: 'A' }, sourcePosition: 'right', targetPosition: 'left' },
  { id: 'B', position: { x: 250, y: 0 }, data: { label: 'B' }, sourcePosition: 'right', targetPosition: 'left' },
  { id: 'C', position: { x: 250, y: 150 }, data: { label: 'C' }, sourcePosition: 'right', targetPosition: 'left' },
  { id: 'D', position: { x: 250, y: 300 }, data: { label: 'D' }, sourcePosition: 'right', targetPosition: 'left' },
];

const colorModeEdges = [
  { id: 'A-B', source: 'A', target: 'B' },
  { id: 'A-C', source: 'A', target: 'C' },
  { id: 'A-D', source: 'A', target: 'D' },
];

export const colorModeSvelteConfig = {
  flowProps: {
    fitView: true,
    nodes: colorModeNodes,
    edges: colorModeEdges,
  },
} satisfies SharedFlowConfig;

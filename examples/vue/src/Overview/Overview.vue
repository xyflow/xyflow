<script lang="ts" setup>
import type { Edge, FlowEvents, Node, SnapGrid, Styles, VueFlowInstance } from '@xyflow/vue';
import { Background, Controls, isEdge, isNode, MarkerType, MiniMap, VueFlow } from '@xyflow/vue';

function onNodeDragStart(e: FlowEvents['nodeDragStart']) {
  return console.log('drag start', e);
}
function onNodeDrag(e: FlowEvents['nodeDrag']) {
  return console.log('drag', e);
}
function onNodeDragStop(e: FlowEvents['nodeDragStop']) {
  return console.log('drag stop', e);
}
function onNodeDoubleClick(e: FlowEvents['nodeDoubleClick']) {
  return console.log('node double click', e);
}
function onPaneClick(e: FlowEvents['paneClick']) {
  return console.log('pane click', e);
}
function onPaneScroll(e: FlowEvents['paneScroll']) {
  return console.log('pane scroll', e);
}
function onPaneContextMenu(e: FlowEvents['paneContextMenu']) {
  return console.log('pane context menu', e);
}
function onSelectionDrag(e: FlowEvents['selectionDrag']) {
  return console.log('selection drag', e);
}
function onSelectionDragStart(e: FlowEvents['selectionDragStart']) {
  return console.log('selection drag start', e);
}
function onSelectionDragStop(e: FlowEvents['selectionDragStop']) {
  return console.log('selection drag stop', e);
}
function onSelectionContextMenu(e: FlowEvents['selectionContextMenu']) {
  return console.log('selection context menu', e);
}
function onLoad(flowInstance: VueFlowInstance) {
  console.log('flow loaded:', flowInstance);
  flowInstance.fitView();
}

function onMoveEnd(e: FlowEvents['moveEnd']) {
  return console.log('zoom/move end', e.viewport);
}
function onEdgeContextMenu(e: FlowEvents['edgeContextMenu']) {
  return console.log('edge context menu', e);
}
function onEdgeMouseEnter(e: FlowEvents['edgeMouseEnter']) {
  return console.log('edge mouse enter', e);
}
function onEdgeMouseMove(e: FlowEvents['edgeMouseMove']) {
  return console.log('edge mouse move', e);
}
function onEdgeMouseLeave(e: FlowEvents['edgeMouseLeave']) {
  return console.log('edge mouse leave', e);
}
function onEdgeDoubleClick(e: FlowEvents['edgeDoubleClick']) {
  return console.log('edge double click', e);
}

const initialElements: (Node | Edge)[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Welcome to <strong>Vue VueFlow!</strong>' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'This is a <strong>default node</strong>' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'This one has a <strong>custom style</strong>' },
    position: { x: 400, y: 100 },
    style: { background: '#D6D5E6', color: '#333', border: '1px solid #222138', width: 180 },
  },
  {
    id: '4',
    position: { x: 250, y: 200 },
    data: {
      label: `You can find the docs on
          <a href="https://github.com/bcakmakoglu/vue-flow" target="_blank" rel="noopener noreferrer">
            Github
          </a>`,
    },
  },
  {
    id: '5',
    data: { label: 'Or check out the other <strong>examples</strong>' },
    position: { x: 250, y: 325 },
  },
  {
    id: '6',
    type: 'output',
    data: { label: 'An <strong>output node</strong>' },
    position: { x: 100, y: 480 },
  },
  { id: '7', type: 'output', data: { label: 'Another output node' }, position: { x: 400, y: 450 } },
  { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4', animated: true, label: 'animated edge' },
  { id: 'e4-5', source: '4', target: '5', markerEnd: { type: MarkerType.ArrowClosed }, label: 'edge with arrowhead' },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', label: 'smooth step edge' },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    type: 'step',
    style: { stroke: '#f6ab6c' },
    label: 'a step edge',
    animated: true,
    labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
  },
];

const snapGrid: SnapGrid = [16, 16];

function nodeStrokeColor(n: Node): string {
  if ((n.style as Styles)?.background) {
    return (n.style as Styles).background as string;
  }
  if (n.type === 'input') {
    return '#0041d0';
  }
  if (n.type === 'output') {
    return '#ff0072';
  }
  if (n.type === 'default') {
    return '#1a192b';
  }

  return '#eee';
}

function nodeColor(n: Node): string {
  if ((n.style as Styles)?.background) {
    return (n.style as Styles).background as string;
  }

  return '#fff';
}

const nodes = ref<Node[]>(initialElements.filter(isNode));
const edges = ref<Edge[]>(initialElements.filter(isEdge));
</script>

<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    :connection-line-options="{ style: { stroke: '#ddd' } }"
    snap-to-grid
    :snap-grid="snapGrid"
    @init="onLoad"
    @pane-click="onPaneClick"
    @pane-scroll="onPaneScroll"
    @pane-context-menu="onPaneContextMenu"
    @node-drag-start="onNodeDragStart"
    @node-drag="onNodeDrag"
    @node-drag-stop="onNodeDragStop"
    @node-double-click="onNodeDoubleClick"
    @selection-drag-start="onSelectionDragStart"
    @selection-drag="onSelectionDrag"
    @selection-drag-stop="onSelectionDragStop"
    @selection-context-menu="onSelectionContextMenu"
    @move-end="onMoveEnd"
    @edge-context-menu="onEdgeContextMenu"
    @edge-mouse-enter="onEdgeMouseEnter"
    @edge-mouse-move="onEdgeMouseMove"
    @edge-mouse-leave="onEdgeMouseLeave"
    @edge-double-click="onEdgeDoubleClick"
  >
    <MiniMap :node-stroke-color="nodeStrokeColor" :node-color="nodeColor" :node-border-radius="2" />
    <Controls />
    <Background variant="lines" />
  </VueFlow>
</template>

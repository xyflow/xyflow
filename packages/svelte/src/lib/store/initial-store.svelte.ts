// import { readable, writable } from 'svelte/store';
import {
  infiniteExtent,
  SelectionMode,
  ConnectionMode,
  ConnectionLineType,
  devWarn,
  adoptUserNodes,
  getNodesBounds,
  getViewportForBounds,
  updateConnectionLookup,
  type SelectionRect,
  type SnapGrid,
  type MarkerProps,
  type PanZoomInstance,
  type CoordinateExtent,
  type NodeOrigin,
  type OnError,
  type Viewport,
  type ConnectionLookup,
  type OnConnect,
  type OnConnectStart,
  type OnConnectEnd,
  type NodeLookup,
  type EdgeLookup
} from '@xyflow/system';

import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';
import InputNode from '$lib/components/nodes/InputNode.svelte';
import OutputNode from '$lib/components/nodes/OutputNode.svelte';
import GroupNode from '$lib/components/nodes/GroupNode.svelte';

import {
  BezierEdgeInternal,
  SmoothStepEdgeInternal,
  StraightEdgeInternal,
  StepEdgeInternal
} from '$lib/components/edges';

import type {
  NodeTypes,
  EdgeTypes,
  EdgeLayouted,
  Node,
  Edge,
  FitViewOptions,
  OnDelete,
  OnEdgeCreate,
  OnBeforeDelete,
  IsValidConnection,
  InternalNode
} from '$lib/types';
import { createNodesStore, createEdgesStore } from './utils';
import { initConnectionProps, type ConnectionProps } from './derived-connection-props';

export const initialNodeTypes = {
  input: InputNode,
  output: OutputNode,
  default: DefaultNode,
  group: GroupNode
};

export const initialEdgeTypes = {
  straight: StraightEdgeInternal,
  smoothstep: SmoothStepEdgeInternal,
  default: BezierEdgeInternal,
  step: StepEdgeInternal
};

function createSignal<T, N extends string>(name: N, value: T): { [K in N]: T } {
  let variable = $state(value);
  return {
    get [name]() {
      return variable;
    },
    set [name](newValue: T) {
      variable = newValue;
    }
  } as { [K in N]: T };
}

export const getInitialStore = ({
  nodes = [],
  edges = [],
  width,
  height,
  fitView
}: {
  nodes?: Node[];
  edges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
}) => {
  const nodeLookup: NodeLookup = new Map();
  const parentLookup = new Map();
  adoptUserNodes(nodes, nodeLookup, parentLookup, {
    nodeOrigin: [0, 0],
    elevateNodesOnSelect: false,
    checkEquality: false
  });
  const connectionLookup = new Map();
  const edgeLookup = new Map();
  updateConnectionLookup(connectionLookup, edgeLookup, edges);

  let viewport: Viewport = { x: 0, y: 0, zoom: 1 };

  if (fitView && width && height) {
    const nodesWithDimensions = nodes.filter(
      (node) => (node.width && node.height) || (node.initialWidth && node.initialHeight)
    );

    // @todo users nodeOrigin should be used here
    const bounds = getNodesBounds(nodesWithDimensions, { nodeOrigin: [0, 0] });
    viewport = getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
  }

  return {
    nodes: createNodesStore(nodes, nodeLookup, parentLookup),
    edges: createEdgesStore(edges, connectionLookup, edgeLookup),
    ...createSignal<string | null, 'flowId'>('flowId', null),
    ...createSignal<NodeLookup<InternalNode>, 'nodeLookup'>('nodeLookup', nodeLookup),
    ...createSignal<Map<string, InternalNode[]>, 'parentLookup'>('parentLookup', parentLookup),
    ...createSignal<EdgeLookup<Edge>, 'edgeLookup'>('edgeLookup', edgeLookup),
    ...createSignal<InternalNode[], 'visibleNodes'>('visibleNodes', []),
    ...createSignal<EdgeLayouted[], 'visibleEdges'>('visibleEdges', []),
    ...createSignal<ConnectionLookup, 'connectionLookup'>('connectionLookup', connectionLookup),
    ...createSignal<number, 'height'>('height', 500),
    ...createSignal<number, 'width'>('width', 500),
    ...createSignal<number, 'minZoom'>('minZoom', 0.5),
    ...createSignal<number, 'maxZoom'>('maxZoom', 2),
    ...createSignal<NodeOrigin, 'nodeOrigin'>('nodeOrigin', [0, 0]),
    ...createSignal<number, 'nodeDragThreshold'>('nodeDragThreshold', 1),
    ...createSignal<CoordinateExtent, 'nodeExtent'>('nodeExtent', infiniteExtent),
    ...createSignal<CoordinateExtent, 'translateExtent'>('translateExtent', infiniteExtent),
    ...createSignal<boolean, 'autoPanOnNodeDrag'>('autoPanOnNodeDrag', true),
    ...createSignal<boolean, 'autoPanOnConnect'>('autoPanOnConnect', true),
    ...createSignal<boolean, 'fitViewOnInit'>('fitViewOnInit', false),
    ...createSignal<boolean, 'fitViewOnInitDone'>('fitViewOnInitDone', false),
    ...createSignal<FitViewOptions, 'fitViewOptions'>('fitViewOptions', {}),
    ...createSignal<Viewport, 'viewport'>('viewport', viewport),
    ...createSignal<PanZoomInstance | null, 'panZoom'>('panZoom', null),
    ...createSignal<SnapGrid | null, 'snapGrid'>('snapGrid', null),
    ...createSignal<boolean, 'dragging'>('dragging', false),
    ...createSignal<SelectionRect | null, 'selectionRect'>('selectionRect', null),
    ...createSignal<boolean, 'selectionKeyPressed'>('selectionKeyPressed', false),
    ...createSignal<boolean, 'multiselectionKeyPressed'>('multiselectionKeyPressed', false),
    ...createSignal<boolean, 'deleteKeyPressed'>('deleteKeyPressed', false),
    ...createSignal<boolean, 'panActivationKeyPressed'>('panActivationKeyPressed', false),
    ...createSignal<boolean, 'zoomActivationKeyPressed'>('zoomActivationKeyPressed', false),
    ...createSignal<string | null, 'selectionRectMode'>('selectionRectMode', null),
    ...createSignal<SelectionMode, 'selectionMode'>('selectionMode', SelectionMode.Partial),
    ...createSignal<NodeTypes, 'nodeTypes'>('nodeTypes', initialNodeTypes),
    ...createSignal<EdgeTypes, 'edgeTypes'>('edgeTypes', initialEdgeTypes),
    ...createSignal<ConnectionMode, 'connectionMode'>('connectionMode', ConnectionMode.Strict),
    ...createSignal<HTMLDivElement | null, 'domNode'>('domNode', null),
    ...createSignal<ConnectionProps, 'connection'>('connection', initConnectionProps),
    ...createSignal<ConnectionLineType, 'connectionLineType'>(
      'connectionLineType',
      ConnectionLineType.Bezier
    ),
    ...createSignal<number, 'connectionRadius'>('connectionRadius', 20),
    ...createSignal<IsValidConnection, 'isValidConnection'>('isValidConnection', () => true),
    ...createSignal<boolean, 'nodesDraggable'>('nodesDraggable', true),
    ...createSignal<boolean, 'nodesConnectable'>('nodesConnectable', true),
    ...createSignal<boolean, 'elementsSelectable'>('elementsSelectable', true),
    ...createSignal<boolean, 'selectNodesOnDrag'>('selectNodesOnDrag', true),
    ...createSignal<MarkerProps[], 'markers'>('markers', []),
    ...createSignal<string, 'defaultMarkerColor'>('defaultMarkerColor', '#b1b1b7'),
    ...createSignal<string, 'lib'>('lib', 'svelte'),
    ...createSignal<boolean, 'onlyRenderVisibleElements'>('onlyRenderVisibleElements', false),
    ...createSignal<OnError, 'onerror'>('onerror', devWarn),
    ...createSignal<OnDelete | undefined, 'ondelete'>('ondelete', undefined),
    ...createSignal<OnEdgeCreate | undefined, 'onedgecreate'>('onedgecreate', undefined),
    ...createSignal<OnConnect | undefined, 'onconnect'>('onconnect', undefined),
    ...createSignal<OnConnectStart | undefined, 'onconnectstart'>('onconnectstart', undefined),
    ...createSignal<OnConnectEnd | undefined, 'onconnectend'>('onconnectend', undefined),
    ...createSignal<OnBeforeDelete | undefined, 'onbeforedelete'>('onbeforedelete', undefined),
    ...createSignal<boolean, 'nodesInitialized'>('nodesInitialized', false),
    ...createSignal<boolean, 'edgesInitialized'>('edgesInitialized', false),
    ...createSignal<boolean, 'viewportInitialized'>('viewportInitialized', false),
    ...createSignal<boolean, 'initialized'>('initialized', false)
  };
};

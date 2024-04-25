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
  type EdgeLookup,
  getEdgePosition,
  getElevatedEdgeZIndex
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
import { derivedSignal, derivedSignalWritable, signal } from './signals.svelte';
import type { SvelteFlowStoreProperties, SvelteFlowStoreState } from './types';
import { get, writable } from 'svelte/store';

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

export const intialValues = {};

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

    // TODO: users nodeOrigin should be used here
    const bounds = getNodesBounds(nodesWithDimensions, { nodeOrigin: [0, 0] });
    viewport = getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
  }

  const store = Object.defineProperties<SvelteFlowStoreState>(
    //@ts-expect-error {} does not match Store, which is fine
    {},
    {
      autoPanOnConnect: signal<SvelteFlowStoreState['autoPanOnConnect']>(true),
      autoPanOnNodeDrag: signal<SvelteFlowStoreState['autoPanOnNodeDrag']>(true),
      connection: signal<SvelteFlowStoreState['connection']>(initConnectionProps),
      connectionLineType: signal<SvelteFlowStoreState['connectionLineType']>(
        ConnectionLineType.Bezier
      ),
      connectionLookup: signal<SvelteFlowStoreState['connectionLookup']>(connectionLookup),
      connectionMode: signal<SvelteFlowStoreState['connectionMode']>(ConnectionMode.Strict),
      connectionRadius: signal<SvelteFlowStoreState['connectionRadius']>(20),
      defaultMarkerColor: signal<SvelteFlowStoreState['defaultMarkerColor']>('#b1b1b7'),
      deleteKeyPressed: signal<SvelteFlowStoreState['deleteKeyPressed']>(false),
      domNode: signal<SvelteFlowStoreState['domNode']>(null),
      dragging: signal<SvelteFlowStoreState['dragging']>(false),
      edgeLookup: signal<SvelteFlowStoreState['edgeLookup']>(edgeLookup),
      edgesInitialized: signal<SvelteFlowStoreState['edgesInitialized']>(true),
      edgeTypes: signal<SvelteFlowStoreState['edgeTypes']>(initialEdgeTypes),
      elementsSelectable: signal<SvelteFlowStoreState['elementsSelectable']>(true),
      fitViewOnInit: signal<SvelteFlowStoreState['fitViewOnInit']>(false),
      fitViewOnInitDone: signal<SvelteFlowStoreState['fitViewOnInitDone']>(false),
      fitViewOptions: signal<SvelteFlowStoreState['fitViewOptions']>({}),
      flowId: signal<SvelteFlowStoreState['flowId']>(null),
      height: signal<SvelteFlowStoreState['height']>(500),
      initialized: signal<SvelteFlowStoreState['initialized']>(true),
      isValidConnection: signal<SvelteFlowStoreState['isValidConnection']>(() => true),
      markers: signal<SvelteFlowStoreState['markers']>([]),
      maxZoom: signal<SvelteFlowStoreState['maxZoom']>(2),
      minZoom: signal<SvelteFlowStoreState['minZoom']>(0.5),
      multiselectionKeyPressed: signal<SvelteFlowStoreState['multiselectionKeyPressed']>(false),
      nodeDragThreshold: signal<SvelteFlowStoreState['nodeDragThreshold']>(1),
      nodeExtent: signal<SvelteFlowStoreState['nodeExtent']>(infiniteExtent),
      nodeLookup: signal<SvelteFlowStoreState['nodeLookup']>(nodeLookup),
      nodeOrigin: signal<SvelteFlowStoreState['nodeOrigin']>([0, 0]),
      nodesConnectable: signal<SvelteFlowStoreState['nodesConnectable']>(true),
      nodesDraggable: signal<SvelteFlowStoreState['nodesDraggable']>(true),
      nodesInitialized: signal<SvelteFlowStoreState['nodesInitialized']>(true),
      nodeTypes: signal<SvelteFlowStoreState['nodeTypes']>(initialNodeTypes),
      onbeforedelete: signal<SvelteFlowStoreState['onbeforedelete']>(undefined),
      onconnect: signal<SvelteFlowStoreState['onconnect']>(undefined),
      onconnectend: signal<SvelteFlowStoreState['onconnectend']>(undefined),
      onconnectstart: signal<SvelteFlowStoreState['onconnectstart']>(undefined),
      ondelete: signal<SvelteFlowStoreState['ondelete']>(undefined),
      onedgecreate: signal<SvelteFlowStoreState['onedgecreate']>(undefined),
      onerror: signal<SvelteFlowStoreState['onerror']>(devWarn),
      onlyRenderVisibleElements: signal<SvelteFlowStoreState['onlyRenderVisibleElements']>(false),
      panActivationKeyPressed: signal<SvelteFlowStoreState['panActivationKeyPressed']>(false),
      panZoom: signal<SvelteFlowStoreState['panZoom']>(null),
      parentLookup: signal<SvelteFlowStoreState['parentLookup']>(parentLookup),
      selectionKeyPressed: signal<SvelteFlowStoreState['selectionKeyPressed']>(false),
      selectionMode: signal<SvelteFlowStoreState['selectionMode']>(SelectionMode.Partial),
      selectionRect: signal<SvelteFlowStoreState['selectionRect']>(null),
      selectionRectMode: signal<SvelteFlowStoreState['selectionRectMode']>(null),
      selectNodesOnDrag: signal<SvelteFlowStoreState['selectNodesOnDrag']>(true),
      snapGrid: signal<SvelteFlowStoreState['snapGrid']>(null),
      translateExtent: signal<SvelteFlowStoreState['translateExtent']>(infiniteExtent),
      // viewport: signal<SvelteFlowStoreState['viewport']>(viewport),
      viewportInitialized: signal<SvelteFlowStoreState['viewportInitialized']>(false),
      // visibleEdges: signal<SvelteFlowStoreState['visibleEdges']>([]),
      visibleNodes: signal<SvelteFlowStoreState['visibleNodes']>([]),
      width: signal<SvelteFlowStoreState['width']>(500),
      zoomActivationKeyPressed: signal<SvelteFlowStoreState['zoomActivationKeyPressed']>(false)
    } satisfies SvelteFlowStoreProperties
  );

  // TODO: just temporary
  Object.assign(store, {
    nodes: createNodesStore(nodes, nodeLookup, parentLookup),
    edges: createEdgesStore(edges, connectionLookup, edgeLookup),
    viewport: writable<Viewport>(viewport)
  });

  Object.defineProperties(store, {
    visibleEdges: derivedSignalWritable<SvelteFlowStoreState['visibleEdges'], Edge[]>(
      (edges) => {
        const layoutedEdges = edges.reduce<EdgeLayouted[]>((res, edge) => {
          const sourceNode = nodeLookup.get(edge.source);
          const targetNode = nodeLookup.get(edge.target);

          if (!sourceNode || !targetNode) {
            return res;
          }

          const edgePosition = getEdgePosition({
            id: edge.id,
            sourceNode,
            targetNode,
            sourceHandle: edge.sourceHandle || null,
            targetHandle: edge.targetHandle || null,
            connectionMode: store.connectionMode,
            onError: store.onerror
          });

          if (edgePosition) {
            res.push({
              ...edge,
              zIndex: getElevatedEdgeZIndex({
                selected: edge.selected,
                zIndex: edge.zIndex,
                sourceNode,
                targetNode,
                elevateOnSelect: false
              }),
              ...edgePosition
            });
          }

          return res;
        }, []);

        return layoutedEdges;
      },
      store.edges,
      store.nodes
    )
  });

  return store;
};

import { get, writable, type Writable } from 'svelte/store';
import {
  infiniteExtent,
  SelectionMode,
  ConnectionMode,
  ConnectionLineType,
  devWarn,
  adoptUserNodes,
  getViewportForBounds,
  updateConnectionLookup,
  initialConnection,
  type SelectionRect,
  type SnapGrid,
  type MarkerProps,
  type PanZoomInstance,
  type CoordinateExtent,
  type NodeOrigin,
  type OnError,
  type Viewport,
  type OnConnect,
  type OnConnectStart,
  type OnConnectEnd,
  type NodeLookup,
  type ConnectionState,
  getInternalNodesBounds,
  type ColorMode,
  createMarkerIds,
  type EdgeLookup,
  type ConnectionLookup,
  type ParentLookup,
  pointToRendererPoint
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
  FitViewOptions,
  OnDelete,
  OnEdgeCreate,
  OnBeforeDelete,
  IsValidConnection
} from '$lib/types';
import { createNodesStore, createEdgesStore } from './utils';
import type { StoreSignals } from './types';

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

export const getInitialStore = (signals: StoreSignals) => {
  class SvelteFlowStore {
    nodes: ReturnType<typeof createNodesStore>;
    edges: ReturnType<typeof createEdgesStore>;

    nodeLookup: NodeLookup = new Map();
    parentLookup: ParentLookup = new Map();
    connectionLookup: ConnectionLookup = new Map();
    edgeLookup: EdgeLookup = new Map();

    domNode: HTMLDivElement | null = $derived(
      signals.container?.domNode ?? signals.props.domNode ?? null
    );
    width: number = $derived(signals.container?.width ?? signals.props.width ?? 0);
    height: number = $derived(signals.container?.height ?? signals.props.height ?? 0);

    flowId: string = $derived(signals.props.id ?? '1');
    minZoom: number = $derived(signals.props.minZoom ?? 0.5);
    maxZoom: number = $derived(signals.props.maxZoom ?? 2);

    nodeOrigin: NodeOrigin = $derived(signals.props.nodeOrigin ?? [0, 0]);
    nodeExtent: CoordinateExtent = $derived(signals.props.nodeExtent ?? infiniteExtent);
    translateExtent: CoordinateExtent = $derived(signals.props.translateExtent ?? infiniteExtent);

    nodeDragThreshold: number = $derived(signals.props.nodeDragThreshold ?? 1);
    autoPanOnNodeDrag: boolean = $derived(signals.props.autoPanOnNodeDrag ?? true);
    autoPanOnConnect: boolean = $derived(signals.props.autoPanOnConnect ?? true);

    fitViewOnInitDone: boolean = $state(false);
    fitViewOnInit: boolean = $derived(signals.props.fitView ?? false);
    fitViewOptions: FitViewOptions | undefined = $derived(signals.props.fitViewOptions);

    panZoom: PanZoomInstance | null = $state(null);
    snapGrid: SnapGrid | null = $derived(signals.props.snapGrid ?? null);

    dragging: boolean = $state(false);
    selectionRect: SelectionRect | null = $state(null);

    selectionKeyPressed: boolean = $state(false);
    multiselectionKeyPressed: boolean = $state(false);
    deleteKeyPressed: boolean = $state(false);
    panActivationKeyPressed: boolean = $state(false);
    zoomActivationKeyPressed: boolean = $state(false);
    selectionRectMode: string | null = $state(null);
    selectionMode: SelectionMode = $derived(signals.props.selectionMode ?? SelectionMode.Partial);

    nodeTypes: NodeTypes = $derived({ ...initialNodeTypes, ...signals.props.nodeTypes });
    edgeTypes: EdgeTypes = $derived({ ...initialEdgeTypes, ...signals.props.edgeTypes });

    viewport: Writable<Viewport> = writable(
      signals.props.initialViewport ?? { x: 0, y: 0, zoom: 1 }
    );

    connectionMode: ConnectionMode = $derived(
      signals.props.connectionMode ?? ConnectionMode.Strict
    );
    rawConnection: ConnectionState = $state(initialConnection);
    connection: ConnectionState = $derived.by(() => {
      if (this.rawConnection.inProgress) {
        const viewport = get(this.viewport);
        return {
          ...this.rawConnection,
          to: pointToRendererPoint(this.rawConnection.to, [viewport.x, viewport.y, viewport.zoom])
        };
      } else {
        return { ...this.rawConnection };
      }
    });
    connectionLineType: ConnectionLineType = $derived(
      signals.props.connectionLineType ?? ConnectionLineType.Bezier
    );
    connectionRadius: number = $derived(signals.props.connectionRadius ?? 20);
    isValidConnection: IsValidConnection = $derived(
      signals.props.isValidConnection ?? (() => true)
    );
    nodesDraggable: boolean = $derived(signals.props.nodesDraggable ?? true);
    nodesConnectable: boolean = $derived(signals.props.nodesConnectable ?? true);
    elementsSelectable: boolean = $derived(signals.props.elementsSelectable ?? true);
    selectNodesOnDrag: boolean = $derived(signals.props.selectNodesOnDrag ?? true);
    //   //   [store.edges, store.defaultMarkerColor, store.flowId],
    //   //   ([edges, defaultColor, id]) => createMarkerIds(edges, { defaultColor, id })
    defaultMarkerColor: string = $derived(signals.props.defaultMarkerColor ?? '#b1b1b7');
    markers: MarkerProps[] = $derived.by(() => {
      const edges = signals.props.edges ?? writable([]);
      return createMarkerIds(get(edges), {
        defaultColor: this.defaultMarkerColor,
        id: this.flowId
      });
    });
    onlyRenderVisibleElements: boolean = $derived(signals.props.onlyRenderVisibleElements ?? false);
    onerror: OnError = $derived(signals.props.onerror ?? devWarn);
    ondelete?: OnDelete = $derived(signals.props.ondelete ?? undefined);
    onedgecreate?: OnEdgeCreate = $derived(signals.props.onedgecreate);
    onconnect?: OnConnect = $derived(signals.props.onconnect);
    onconnectstart?: OnConnectStart = $derived(signals.props.onconnectstart);
    onconnectend?: OnConnectEnd = $derived(signals.props.onconnectend);
    onbeforedelete?: OnBeforeDelete = $derived(signals.props.onbeforedelete);

    nodesInitialized: boolean = $state(false);
    edgesInitialized: boolean = $state(false);
    viewportInitialized: boolean = $state(false);

    initialNodesLength: number = signals.props.nodes ? get(signals.props.nodes)?.length : 0;
    initialEdgesLength: number = signals.props.edges ? get(signals.props.edges)?.length : 0;
    initialized: boolean = $derived.by(() => {
      let initialized = false;
      // if it hasn't been initialised check if it's now
      if (this.initialNodesLength === 0) {
        initialized = this.viewportInitialized;
      } else if (this.initialEdgesLength === 0) {
        initialized = this.viewportInitialized && this.nodesInitialized;
      } else {
        initialized = this.viewportInitialized && this.nodesInitialized && this.edgesInitialized;
      }

      return initialized;
    });
    colorMode: ColorMode = $derived(signals.props.colorMode ?? 'light');

    constructor() {
      const nodes = signals.props.nodes ? get(signals.props.nodes) : [];
      const edges = signals.props.edges ? get(signals.props.edges) : [];

      this.nodes = createNodesStore(
        nodes,
        this.nodeLookup,
        this.parentLookup,
        this.nodeOrigin,
        this.nodeExtent
      );

      adoptUserNodes(nodes, this.nodeLookup, this.parentLookup, {
        nodeExtent: this.nodeExtent,
        nodeOrigin: this.nodeOrigin,
        elevateNodesOnSelect: false,
        checkEquality: false
      });

      this.edges = createEdgesStore(edges, this.connectionLookup, this.edgeLookup);
      updateConnectionLookup(this.connectionLookup, this.edgeLookup, edges);

      if (signals.props.fitView && this.width && this.height) {
        const bounds = getInternalNodesBounds(this.nodeLookup, {
          filter: (node) =>
            !!((node.width || node.initialWidth) && (node.height || node.initialHeight))
        });
        this.viewport.set(getViewportForBounds(bounds, this.width, this.height, 0.5, 2, 0.1));
      }
    }

    resetStoreValues() {
      // TODO: reset all store values here
    }
  }
  return new SvelteFlowStore();

  // return new Store();
  // const nodeLookup: NodeLookup = new Map();
  // const parentLookup = new Map();
  // const connectionLookup = new Map();
  // const edgeLookup = new Map();

  // const storeNodeOrigin = nodeOrigin ?? [0, 0];
  // const storeNodeExtent = nodeExtent ?? infiniteExtent;

  // adoptUserNodes(nodes, nodeLookup, parentLookup, {
  //   nodeExtent: storeNodeExtent,
  //   nodeOrigin: storeNodeOrigin,
  //   elevateNodesOnSelect: false,
  //   checkEquality: false
  // });

  // updateConnectionLookup(connectionLookup, edgeLookup, edges);

  // let viewport: Viewport = { x: 0, y: 0, zoom: 1 };

  // if (fitView && width && height) {
  //   const bounds = getInternalNodesBounds(nodeLookup, {
  //     filter: (node) => !!((node.width || node.initialWidth) && (node.height || node.initialHeight))
  //   });
  //   viewport = getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
  // }

  // return {
  //   flowId: writable<string | null>(null),
  //   nodes: createNodesStore(nodes, nodeLookup, parentLookup, storeNodeOrigin, storeNodeExtent),
  //   nodeLookup: readable<NodeLookup<InternalNode>>(nodeLookup),
  //   parentLookup: readable<ParentLookup<InternalNode>>(parentLookup),
  //   edgeLookup: readable<EdgeLookup<Edge>>(edgeLookup),
  //   visibleNodes: readable<InternalNode[]>([]),
  //   edges: createEdgesStore(edges, connectionLookup, edgeLookup),
  //   visibleEdges: readable<EdgeLayouted[]>([]),
  //   connectionLookup: readable<ConnectionLookup>(connectionLookup),
  //   height: writable<number>(500),
  //   width: writable<number>(500),
  //   minZoom: writable<number>(0.5),
  //   maxZoom: writable<number>(2),
  //   nodeOrigin: writable<NodeOrigin>(storeNodeOrigin),
  //   nodeDragThreshold: writable<number>(1),
  //   nodeExtent: writable<CoordinateExtent>(storeNodeExtent),
  //   translateExtent: writable<CoordinateExtent>(infiniteExtent),
  //   autoPanOnNodeDrag: writable<boolean>(true),
  //   autoPanOnConnect: writable<boolean>(true),
  //   fitViewOnInit: writable<boolean>(false),
  //   fitViewOnInitDone: writable<boolean>(false),
  //   fitViewOptions: writable<FitViewOptions>(undefined),
  //   panZoom: writable<PanZoomInstance | null>(null),
  //   snapGrid: writable<SnapGrid | null>(null),
  //   dragging: writable<boolean>(false),
  //   selectionRect: writable<SelectionRect | null>(null),
  //   selectionKeyPressed: writable<boolean>(false),
  //   multiselectionKeyPressed: writable<boolean>(false),
  //   deleteKeyPressed: writable<boolean>(false),
  //   panActivationKeyPressed: writable<boolean>(false),
  //   zoomActivationKeyPressed: writable<boolean>(false),
  //   selectionRectMode: writable<string | null>(null),
  //   selectionMode: writable<SelectionMode>(SelectionMode.Partial),
  //   nodeTypes: writable<NodeTypes>(initialNodeTypes),
  //   edgeTypes: writable<EdgeTypes>(initialEdgeTypes),
  //   viewport: writable<Viewport>(viewport),
  //   connectionMode: writable<ConnectionMode>(ConnectionMode.Strict),
  //   domNode: writable<HTMLDivElement | null>(null),
  //   connection: readable<ConnectionState>(initialConnection),
  //   connectionLineType: writable<ConnectionLineType>(ConnectionLineType.Bezier),
  //   connectionRadius: writable<number>(20),
  //   isValidConnection: writable<IsValidConnection>(() => true),
  //   nodesDraggable: writable<boolean>(true),
  //   nodesConnectable: writable<boolean>(true),
  //   elementsSelectable: writable<boolean>(true),
  //   selectNodesOnDrag: writable<boolean>(true),
  //   markers: readable<MarkerProps[]>([]),
  //   defaultMarkerColor: writable<string>('#b1b1b7'),
  //   lib: readable<string>('svelte'),
  //   onlyRenderVisibleElements: writable<boolean>(false),
  //   onerror: writable<OnError>(devWarn),
  //   ondelete: writable<OnDelete>(undefined),
  //   onedgecreate: writable<OnEdgeCreate>(undefined),
  //   onconnect: writable<OnConnect>(undefined),
  //   onconnectstart: writable<OnConnectStart>(undefined),
  //   onconnectend: writable<OnConnectEnd>(undefined),
  //   onbeforedelete: writable<OnBeforeDelete>(undefined),
  //   nodesInitialized: writable<boolean>(false),
  //   edgesInitialized: writable<boolean>(false),
  //   viewportInitialized: writable<boolean>(false),
  //   initialized: readable<boolean>(false)
  // };
};

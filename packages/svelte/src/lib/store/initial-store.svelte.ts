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
  createMarkerIds,
  type EdgeLookup,
  type ConnectionLookup,
  type ParentLookup,
  pointToRendererPoint,
  type ColorModeClass,
  type Transform
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
  IsValidConnection,
  Edge,
  Node,
  EdgeLayouted
} from '$lib/types';

import type { StoreSignals } from './types';
import { MediaQuery } from 'svelte/reactivity';
import { gatherLayoutedEdges, getVisibleNodes } from './visibleElements';

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
  const previousLayoutedEdges = new Map<string, EdgeLayouted>();
  // We use a class here, because Svelte adds getters & setter for us.
  // Inline classes have some performance implications but we just call it once (max twice).
  class SvelteFlowStore {
    _nodes: Node[] = $derived.by(() => {
      adoptUserNodes(signals.nodes, this.nodeLookup, this.parentLookup, {
        nodeExtent: this.nodeExtent,
        nodeOrigin: this.nodeOrigin,
        elevateNodesOnSelect: false,
        checkEquality: true
      });
      return signals.nodes;
    });

    _edges: Edge[] = $derived.by(() => {
      updateConnectionLookup(this.connectionLookup, this.edgeLookup, signals.edges);
      return signals.edges;
    });

    get nodes() {
      return this._nodes;
    }
    set nodes(nodes) {
      signals.nodes = nodes;
    }
    get edges() {
      return this._edges;
    }
    set edges(edges) {
      signals.edges = edges;
    }

    nodeLookup: NodeLookup = new Map();
    parentLookup: ParentLookup = new Map();
    connectionLookup: ConnectionLookup = new Map();
    edgeLookup: EdgeLookup = new Map();

    visible = $derived.by(() => {
      // We need to access this._nodes to trigger on changes
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this._nodes;

      // We either add all or only visible nodes to visibleNodes here.
      let visibleNodes = new Map();
      let layoutedEdges = new Map<string, EdgeLayouted>();
      // TODO: is there a more elegant solution??
      if (this.onlyRenderVisibleElements) {
        const transform: Transform = [this.viewport.x, this.viewport.y, this.viewport.zoom];
        getVisibleNodes(this.nodeLookup, transform, this.width, this.height).forEach((node) => {
          visibleNodes.set(node.id, node);
        });
        layoutedEdges = gatherLayoutedEdges(
          this._edges,
          this.nodeLookup,
          previousLayoutedEdges,
          this.connectionMode,
          this.onerror,
          true,
          transform,
          this.width,
          this.height,
          visibleNodes
        );
      } else {
        visibleNodes = this.nodeLookup;
        layoutedEdges = gatherLayoutedEdges(
          this._edges,
          this.nodeLookup,
          previousLayoutedEdges,
          this.connectionMode,
          this.onerror,
          false
        );
      }

      return {
        nodes: visibleNodes,
        edges: layoutedEdges
      };
    });

    domNode: HTMLDivElement | null = $derived(signals.domNode ?? null);
    width: number = $derived(signals.width ?? signals.props.width ?? 0);
    height: number = $derived(signals.height ?? signals.props.height ?? 0);

    flowId: string = $derived(signals.props.id ?? '1');
    minZoom: number = $derived(signals.props.minZoom ?? 0.5);
    maxZoom: number = $derived(signals.props.maxZoom ?? 2);

    nodeOrigin: NodeOrigin = $derived(signals.props.nodeOrigin ?? [0, 0]);
    nodeExtent: CoordinateExtent = $derived(signals.props.nodeExtent ?? infiniteExtent);
    translateExtent: CoordinateExtent = $derived(signals.props.translateExtent ?? infiniteExtent);

    defaultEdgeOptions: Partial<Edge> = $derived(signals.props.defaultEdgeOptions ?? {});
    defaultNodeOptions: Partial<Node> = $derived(signals.props.defaultNodeOptions ?? {});

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

    // _viewport is the internal viewport. We either return signals.viewport or _viewport
    _viewport: Viewport = $state(signals.props.initialViewport ?? { x: 0, y: 0, zoom: 1 });
    get viewport() {
      return signals.viewport ?? this._viewport;
    }
    set viewport(viewport: Viewport) {
      if (signals.viewport) {
        signals.viewport = viewport;
      }
      this._viewport = viewport;
    }

    connectionMode: ConnectionMode = $derived(
      signals.props.connectionMode ?? ConnectionMode.Strict
    );
    rawConnection: ConnectionState = $state(initialConnection);
    connection: ConnectionState = $derived.by(() => {
      if (this.rawConnection.inProgress) {
        return {
          ...this.rawConnection,
          to: pointToRendererPoint(this.rawConnection.to, [
            this.viewport.x,
            this.viewport.y,
            this.viewport.zoom
          ])
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

    defaultMarkerColor: string = $derived(signals.props.defaultMarkerColor ?? '#b1b1b7');
    markers: MarkerProps[] = $derived.by(() => {
      return createMarkerIds(signals.edges, {
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

    initialNodesLength: number = signals.nodes?.length ?? 0;
    initialEdgesLength: number = signals.edges?.length ?? 0;
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
    prefersDark = new MediaQuery(
      '(prefers-color-scheme: dark)',
      signals.props.colorModeSSR === 'dark'
    );
    colorMode: ColorModeClass = $derived(
      signals.props.colorMode === 'system'
        ? this.prefersDark.current
          ? 'dark'
          : 'light'
        : (signals.props.colorMode ?? 'light')
    );

    constructor() {
      // Process intial fitView here
      if (signals.props.fitView && !signals.props.initialViewport && this.width && this.height) {
        const bounds = getInternalNodesBounds(this.nodeLookup, {
          filter: (node) =>
            !!((node.width || node.initialWidth) && (node.height || node.initialHeight))
        });
        this.viewport = getViewportForBounds(bounds, this.width, this.height, 0.5, 2, 0.1);
      }

      if (process.env.NODE_ENV === 'development') {
        warnIfDeeplyReactive(signals.nodes, 'nodes');
        warnIfDeeplyReactive(signals.edges, 'edges');
      }
    }

    resetStoreValues() {
      // TODO: reset all store values here
    }
  }
  return new SvelteFlowStore();
};

// Only way to check if an object is a proxy
// is to see if is failes to perform a structured clone
// TODO: is $state.raw really nessessary?
function warnIfDeeplyReactive(array: unknown[] | undefined, name: string) {
  try {
    if (array && array.length > 0) {
      structuredClone(array[0]);
    }
  } catch {
    console.warn(`Use $state.raw for ${name} to prevent performance issues.`);
  }
}

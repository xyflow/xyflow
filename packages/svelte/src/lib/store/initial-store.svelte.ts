import {
  infiniteExtent,
  SelectionMode,
  ConnectionMode,
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
  type Transform,
  fitViewport
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
  EdgeLayouted,
  InternalNode
} from '$lib/types';

import type { StoreSignals } from './types';
import { MediaQuery } from 'svelte/reactivity';
import { getLayoutedEdges, getVisibleNodes, type EdgeLayoutAllOptions } from './visibleElements';

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
  // We use a class here, because Svelte adds getters & setter for us.
  // Inline classes have some performance implications but we just call it once (max twice).
  class SvelteFlowStore {
    flowId: string = $derived(signals.props.id ?? '1');
    domNode = $state<HTMLDivElement | null>(null);
    panZoom: PanZoomInstance | null = $state(null);
    width = $state<number>(signals.width ?? 0);
    height = $state<number>(signals.height ?? 0);

    nodesInitialized: boolean = $derived.by(() => {
      const nodesInitialized = adoptUserNodes(signals.nodes, this.nodeLookup, this.parentLookup, {
        nodeExtent: this.nodeExtent,
        nodeOrigin: this.nodeOrigin,
        elevateNodesOnSelect: signals.props.elevateNodesOnSelect ?? true,
        checkEquality: true
      });

      if (this.fitViewQueued && nodesInitialized) {
        if (this.fitViewOptions?.duration) {
          this.resolveFitView();
        } else {
          /**
           * When no duration is set, viewport is set immediately which prevents an update
           * I do not understand why, however we are setting state in a derived which is a no-go
           */
          queueMicrotask(() => {
            this.resolveFitView();
          });
        }
      }

      return nodesInitialized;
    });
    edgesInitialized: boolean = $state(false);
    viewportInitialized: boolean = $derived(this.panZoom !== null);

    // TODO: Figure out initialized
    _initialNodesLength: number = signals.nodes?.length ?? 0;
    _initialEdgesLength: number = signals.edges?.length ?? 0;
    initialized: boolean = $derived.by(() => {
      let initialized = false;
      // if it hasn't been initialised check if it's now
      if (this._initialNodesLength === 0) {
        initialized = this.viewportInitialized;
      } else if (this._initialEdgesLength === 0) {
        initialized = this.viewportInitialized && this.nodesInitialized;
      } else {
        initialized = this.viewportInitialized && this.nodesInitialized && this.edgesInitialized;
      }

      return initialized;
    });

    _edges: Edge[] = $derived.by(() => {
      updateConnectionLookup(this.connectionLookup, this.edgeLookup, signals.edges);
      return signals.edges;
    });

    get nodes() {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.nodesInitialized;
      return signals.nodes;
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

    _prevVisibleEdges = new Map<string, EdgeLayouted>();
    visible = $derived.by(() => {
      const {
        // We need to access this._nodes to trigger on changes
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nodes,
        _edges: edges,
        _prevVisibleEdges: previousEdges,
        nodeLookup,
        connectionMode,
        onerror,
        onlyRenderVisibleElements
      } = this;

      let visibleNodes: Map<string, InternalNode>;
      let visibleEdges: Map<string, EdgeLayouted>;

      const options = { edges, previousEdges, nodeLookup, connectionMode, onerror };

      if (onlyRenderVisibleElements) {
        // We only subscribe to viewport, width, height if onlyRenderVisibleElements is true
        const { viewport, width, height } = this;
        const transform: Transform = [viewport.x, viewport.y, viewport.zoom];

        visibleNodes = getVisibleNodes(nodeLookup, transform, width, height);
        visibleEdges = getLayoutedEdges({
          ...options,
          onlyRenderVisible: true,
          visibleNodes,
          transform,
          width,
          height
        });
      } else {
        visibleNodes = this.nodeLookup;
        visibleEdges = getLayoutedEdges(options as EdgeLayoutAllOptions);
      }

      return {
        nodes: visibleNodes,
        edges: visibleEdges
      };
    });

    get nodesDraggable() {
      return signals.nodesDraggable;
    }
    set nodesDraggable(value: boolean) {
      signals.nodesDraggable = value;
    }
    get nodesConnectable() {
      return signals.nodesConnectable;
    }
    set nodesConnectable(value: boolean) {
      signals.nodesConnectable = value;
    }
    get elementsSelectable() {
      return signals.elementsSelectable;
    }
    set elementsSelectable(value: boolean) {
      signals.elementsSelectable = value;
    }

    minZoom: number = $derived(signals.props.minZoom ?? 0.5);
    maxZoom: number = $derived(signals.props.maxZoom ?? 2);

    nodeOrigin: NodeOrigin = $derived(signals.props.nodeOrigin ?? [0, 0]);
    nodeExtent: CoordinateExtent = $derived(signals.props.nodeExtent ?? infiniteExtent);
    translateExtent: CoordinateExtent = $derived(signals.props.translateExtent ?? infiniteExtent);

    defaultEdgeOptions: Partial<Edge> = $derived(signals.props.defaultEdgeOptions ?? {});

    nodeDragThreshold: number = $derived(signals.props.nodeDragThreshold ?? 1);
    autoPanOnNodeDrag: boolean = $derived(signals.props.autoPanOnNodeDrag ?? true);
    autoPanOnConnect: boolean = $derived(signals.props.autoPanOnConnect ?? true);

    fitViewQueued: boolean = signals.props.fitView ?? false;
    fitViewOptions: FitViewOptions | undefined = signals.props.fitViewOptions;
    fitViewResolver: PromiseWithResolvers<boolean> | null = null;

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

    // _viewport is the internal viewport.
    // when binding to viewport, we operate on signals.viewport instead
    initial: boolean = true;
    _viewport: Viewport = $state(signals.props.initialViewport ?? { x: 0, y: 0, zoom: 1 });
    get viewport() {
      return signals.viewport ?? this._viewport;
    }
    set viewport(newViewport: Viewport) {
      if (signals.viewport) {
        signals.viewport = newViewport;
      }
      this._viewport = newViewport;
    }

    // _connection is viewport independent and originating from XYHandle
    _connection: ConnectionState = $state(initialConnection);
    // We derive a viewport dependent connection here
    connection: ConnectionState = $derived.by(() => {
      if (this._connection.inProgress) {
        return {
          ...this._connection,
          to: pointToRendererPoint(this._connection.to, [
            this.viewport.x,
            this.viewport.y,
            this.viewport.zoom
          ])
        };
      } else {
        return this._connection;
      }
    });
    connectionMode: ConnectionMode = $derived(
      signals.props.connectionMode ?? ConnectionMode.Strict
    );
    connectionRadius: number = $derived(signals.props.connectionRadius ?? 20);
    isValidConnection: IsValidConnection = $derived(
      signals.props.isValidConnection ?? (() => true)
    );

    selectNodesOnDrag: boolean = $derived(signals.props.selectNodesOnDrag ?? true);

    defaultMarkerColor: string = $derived(signals.props.defaultMarkerColor ?? '#b1b1b7');
    markers: MarkerProps[] = $derived.by(() => {
      return createMarkerIds(signals.edges, {
        defaultColor: this.defaultMarkerColor,
        id: this.flowId,
        defaultMarkerStart: this.defaultEdgeOptions.markerStart,
        defaultMarkerEnd: this.defaultEdgeOptions.markerEnd
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

    resolveFitView = async () => {
      if (!this.panZoom) {
        return;
      }

      await fitViewport(
        {
          nodes: this.nodeLookup,
          width: this.width,
          height: this.height,
          panZoom: this.panZoom,
          minZoom: this.minZoom,
          maxZoom: this.maxZoom
        },
        this.fitViewOptions
      );

      this.fitViewResolver?.resolve(true);
      /**
       * wait for the fitViewport to resolve before deleting the resolver,
       * we want to reuse the old resolver if the user calls fitView again in the mean time
       */
      this.fitViewQueued = false;
      this.fitViewOptions = undefined;
      this.fitViewResolver = null;
    };

    _prefersDark = new MediaQuery(
      '(prefers-color-scheme: dark)',
      signals.props.colorModeSSR === 'dark'
    );
    colorMode: ColorModeClass = $derived(
      signals.props.colorMode === 'system'
        ? this._prefersDark.current
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
function warnIfDeeplyReactive(array: unknown[] | undefined, name: string) {
  try {
    if (array && array.length > 0) {
      structuredClone(array[0]);
    }
  } catch {
    console.warn(`Use $state.raw for ${name} to prevent performance issues.`);
  }
}

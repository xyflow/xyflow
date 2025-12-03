/* eslint-disable svelte/prefer-svelte-reactivity */

import {
  infiniteExtent,
  SelectionMode,
  ConnectionMode,
  devWarn,
  adoptUserNodes,
  getViewportForBounds,
  updateConnectionLookup,
  initialConnection,
  mergeAriaLabelConfig,
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
  fitViewport,
  type Handle,
  type OnReconnect,
  type OnReconnectStart,
  type OnReconnectEnd,
  type AriaLabelConfig,
  type ZIndexMode
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
  OnBeforeConnect,
  OnBeforeDelete,
  IsValidConnection,
  Edge,
  Node,
  EdgeLayouted,
  InternalNode,
  OnBeforeReconnect,
  OnSelectionChange,
  OnSelectionDrag
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

function getInitialViewport(
  // This is just used to make sure adoptUserNodes is called before we calculate the viewport
  _nodesInitialized: boolean,
  fitView: boolean | undefined,
  initialViewport: Viewport | undefined,
  width: number,
  height: number,
  nodeLookup: NodeLookup
) {
  if (fitView && !initialViewport && width && height) {
    const bounds = getInternalNodesBounds(nodeLookup, {
      filter: (node) => !!((node.width || node.initialWidth) && (node.height || node.initialHeight))
    });
    return getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
  } else {
    return initialViewport ?? { x: 0, y: 0, zoom: 1 };
  }
}

export function getInitialStore<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  signals: StoreSignals<NodeType, EdgeType>
) {
  // We use a class here, because Svelte adds getters & setter for us.
  // Inline classes have some performance implications but we just call it once (max twice).
  class SvelteFlowStore {
    flowId: string = $derived(signals.props.id ?? '1');
    domNode = $state.raw<HTMLDivElement | null>(null);
    panZoom: PanZoomInstance | null = $state.raw(null);
    width = $state.raw<number>(signals.width ?? 0);
    height = $state.raw<number>(signals.height ?? 0);
    zIndexMode = $state.raw<ZIndexMode>(signals.props.zIndexMode ?? 'basic');

    nodesInitialized: boolean = $derived.by(() => {
      const nodesInitialized = adoptUserNodes(signals.nodes, this.nodeLookup, this.parentLookup, {
        nodeExtent: this.nodeExtent,
        nodeOrigin: this.nodeOrigin,
        elevateNodesOnSelect: signals.props.elevateNodesOnSelect ?? true,
        checkEquality: true,
        zIndexMode: this.zIndexMode
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
    viewportInitialized: boolean = $derived(this.panZoom !== null);

    _edges: EdgeType[] = $derived.by(() => {
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

    _prevSelectedNodes: NodeType[] = [];
    _prevSelectedNodeIds = new Set<string>();
    selectedNodes = $derived.by(() => {
      const selectedNodesCount = this._prevSelectedNodeIds.size;
      const selectedNodeIds = new Set<string>();
      const selectedNodes = this.nodes.filter((node) => {
        if (node.selected) {
          selectedNodeIds.add(node.id);
          this._prevSelectedNodeIds.delete(node.id);
        }
        return node.selected;
      });

      // Either the number of selected nodes has changed or two nodes changed their selection state
      // at the same time. However then the previously selected node will be inside _prevSelectedNodeIds
      if (selectedNodesCount !== selectedNodeIds.size || this._prevSelectedNodeIds.size > 0) {
        this._prevSelectedNodes = selectedNodes;
      }

      this._prevSelectedNodeIds = selectedNodeIds;
      return this._prevSelectedNodes;
    });

    _prevSelectedEdges: EdgeType[] = [];
    _prevSelectedEdgeIds = new Set<string>();
    selectedEdges = $derived.by(() => {
      const selectedEdgesCount = this._prevSelectedEdgeIds.size;
      const selectedEdgeIds = new Set<string>();
      const selectedEdges = this.edges.filter((edge) => {
        if (edge.selected) {
          selectedEdgeIds.add(edge.id);
          this._prevSelectedEdgeIds.delete(edge.id);
        }
        return edge.selected;
      });
      // Either the number of selected edges has changed or two edges changed their selection state
      // at the same time. However then the previously selected edge will be inside _prevSelectedEdgeIds
      if (selectedEdgesCount !== selectedEdgeIds.size || this._prevSelectedEdgeIds.size > 0) {
        this._prevSelectedEdges = selectedEdges;
      }
      this._prevSelectedEdgeIds = selectedEdgeIds;
      return this._prevSelectedEdges;
    });

    selectionChangeHandlers = new Map<symbol, OnSelectionChange<NodeType, EdgeType>>();

    nodeLookup: NodeLookup<InternalNode<NodeType>> = new Map();
    parentLookup: ParentLookup<InternalNode<NodeType>> = new Map();
    connectionLookup: ConnectionLookup = new Map();
    edgeLookup: EdgeLookup<EdgeType> = new Map();

    _prevVisibleEdges = new Map<string, EdgeLayouted<EdgeType>>();
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
        onlyRenderVisibleElements,
        defaultEdgeOptions,
        zIndexMode
      } = this;

      let visibleNodes: Map<string, InternalNode<NodeType>>;
      let visibleEdges: Map<string, EdgeLayouted<EdgeType>>;

      const options = {
        edges,
        defaultEdgeOptions,
        previousEdges,
        nodeLookup,
        connectionMode,
        elevateEdgesOnSelect: signals.props.elevateEdgesOnSelect ?? true,
        zIndexMode,
        onerror
      };

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
        visibleEdges = getLayoutedEdges(options as EdgeLayoutAllOptions<NodeType, EdgeType>);
      }

      return {
        nodes: visibleNodes,
        edges: visibleEdges
      };
    });

    nodesDraggable: boolean = $derived(signals.props.nodesDraggable ?? true);
    nodesConnectable: boolean = $derived(signals.props.nodesConnectable ?? true);
    elementsSelectable: boolean = $derived(signals.props.elementsSelectable ?? true);
    nodesFocusable: boolean = $derived(signals.props.nodesFocusable ?? true);
    edgesFocusable: boolean = $derived(signals.props.edgesFocusable ?? true);

    disableKeyboardA11y: boolean = $derived(signals.props.disableKeyboardA11y ?? false);

    minZoom: number = $derived(signals.props.minZoom ?? 0.5);
    maxZoom: number = $derived(signals.props.maxZoom ?? 2);

    nodeOrigin: NodeOrigin = $derived(signals.props.nodeOrigin ?? [0, 0]);
    nodeExtent: CoordinateExtent = $derived(signals.props.nodeExtent ?? infiniteExtent);
    translateExtent: CoordinateExtent = $derived(signals.props.translateExtent ?? infiniteExtent);

    defaultEdgeOptions: Partial<Edge> = $derived(signals.props.defaultEdgeOptions ?? {});

    nodeDragThreshold: number = $derived(signals.props.nodeDragThreshold ?? 1);
    autoPanOnNodeDrag: boolean = $derived(signals.props.autoPanOnNodeDrag ?? true);
    autoPanOnConnect: boolean = $derived(signals.props.autoPanOnConnect ?? true);
    autoPanOnNodeFocus: boolean = $derived(signals.props.autoPanOnNodeFocus ?? true);
    autoPanSpeed: number = $derived(signals.props.autoPanSpeed ?? 15);
    connectionDragThreshold: number = $derived(signals.props.connectionDragThreshold ?? 1);

    fitViewQueued: boolean = signals.props.fitView ?? false;
    fitViewOptions: FitViewOptions | undefined = signals.props.fitViewOptions;
    fitViewResolver: PromiseWithResolvers<boolean> | null = null;

    snapGrid: SnapGrid | null = $derived(signals.props.snapGrid ?? null);

    dragging: boolean = $state.raw(false);
    selectionRect: SelectionRect | null = $state.raw(null);

    selectionKeyPressed: boolean = $state.raw(false);
    multiselectionKeyPressed: boolean = $state.raw(false);
    deleteKeyPressed: boolean = $state.raw(false);
    panActivationKeyPressed: boolean = $state.raw(false);
    zoomActivationKeyPressed: boolean = $state.raw(false);
    selectionRectMode: string | null = $state.raw(null);
    ariaLiveMessage = $state.raw<string>('');
    selectionMode: SelectionMode = $derived(signals.props.selectionMode ?? SelectionMode.Partial);

    nodeTypes: NodeTypes = $derived({ ...initialNodeTypes, ...signals.props.nodeTypes });
    edgeTypes: EdgeTypes = $derived({ ...initialEdgeTypes, ...signals.props.edgeTypes });

    noPanClass: string = $derived(signals.props.noPanClass ?? 'nopan');
    noDragClass: string = $derived(signals.props.noDragClass ?? 'nodrag');
    noWheelClass: string = $derived(signals.props.noWheelClass ?? 'nowheel');
    ariaLabelConfig: AriaLabelConfig = $derived(
      mergeAriaLabelConfig(signals.props.ariaLabelConfig)
    );

    // _viewport is the internal viewport.
    // when binding to viewport, we operate on signals.viewport instead
    _viewport: Viewport = $state.raw(
      getInitialViewport(
        this.nodesInitialized,
        signals.props.fitView,
        signals.props.initialViewport,
        this.width,
        this.height,
        this.nodeLookup
      )
    );
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
    _connection: ConnectionState = $state.raw(initialConnection);
    // We derive a viewport dependent connection here
    connection: ConnectionState = $derived.by(() => {
      if (!this._connection.inProgress) {
        return this._connection;
      }

      return {
        ...this._connection,
        to: pointToRendererPoint(this._connection.to, [
          this.viewport.x,
          this.viewport.y,
          this.viewport.zoom
        ])
      };
    });
    connectionMode: ConnectionMode = $derived(
      signals.props.connectionMode ?? ConnectionMode.Strict
    );
    connectionRadius: number = $derived(signals.props.connectionRadius ?? 20);
    isValidConnection: IsValidConnection = $derived(
      signals.props.isValidConnection ?? (() => true)
    );

    selectNodesOnDrag: boolean = $derived(signals.props.selectNodesOnDrag ?? true);

    defaultMarkerColor: string | null = $derived(
      signals.props.defaultMarkerColor === undefined ? '#b1b1b7' : signals.props.defaultMarkerColor
    );
    markers: MarkerProps[] = $derived.by(() => {
      return createMarkerIds(signals.edges, {
        defaultColor: this.defaultMarkerColor,
        id: this.flowId,
        defaultMarkerStart: this.defaultEdgeOptions.markerStart,
        defaultMarkerEnd: this.defaultEdgeOptions.markerEnd
      });
    });
    onlyRenderVisibleElements: boolean = $derived(signals.props.onlyRenderVisibleElements ?? false);
    onerror: OnError = $derived(signals.props.onflowerror ?? devWarn);

    ondelete?: OnDelete<NodeType, EdgeType> = $derived(signals.props.ondelete);
    onbeforedelete?: OnBeforeDelete<NodeType, EdgeType> = $derived(signals.props.onbeforedelete);

    onbeforeconnect?: OnBeforeConnect = $derived(signals.props.onbeforeconnect);
    onconnect?: OnConnect = $derived(signals.props.onconnect);
    onconnectstart?: OnConnectStart = $derived(signals.props.onconnectstart);
    onconnectend?: OnConnectEnd = $derived(signals.props.onconnectend);

    onbeforereconnect?: OnBeforeReconnect<EdgeType> = $derived(signals.props.onbeforereconnect);
    onreconnect?: OnReconnect<EdgeType> = $derived(signals.props.onreconnect);
    onreconnectstart?: OnReconnectStart<EdgeType> = $derived(signals.props.onreconnectstart);
    onreconnectend?: OnReconnectEnd<EdgeType> = $derived(signals.props.onreconnectend);

    clickConnect?: boolean = $derived(signals.props.clickConnect ?? true);
    onclickconnectstart?: OnConnectStart = $derived(signals.props.onclickconnectstart);
    onclickconnectend?: OnConnectEnd = $derived(signals.props.onclickconnectend);
    clickConnectStartHandle: Pick<Handle, 'id' | 'nodeId' | 'type'> | null = $state.raw(null);

    onselectiondrag?: OnSelectionDrag<NodeType> = $derived(signals.props.onselectiondrag);
    onselectiondragstart?: OnSelectionDrag<NodeType> = $derived(signals.props.onselectiondragstart);
    onselectiondragstop?: OnSelectionDrag<NodeType> = $derived(signals.props.onselectiondragstop);

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
      if (process.env.NODE_ENV === 'development') {
        warnIfDeeplyReactive(signals.nodes, 'nodes');
        warnIfDeeplyReactive(signals.edges, 'edges');
      }
    }

    resetStoreValues() {
      this.dragging = false;
      this.selectionRect = null;
      this.selectionRectMode = null;
      this.selectionKeyPressed = false;
      this.multiselectionKeyPressed = false;
      this.deleteKeyPressed = false;
      this.panActivationKeyPressed = false;
      this.zoomActivationKeyPressed = false;
      this._connection = initialConnection;
      this.clickConnectStartHandle = null;
      this.viewport = signals.props.initialViewport ?? { x: 0, y: 0, zoom: 1 };
      this.ariaLiveMessage = '';
    }
  }
  return new SvelteFlowStore();
}

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

/* eslint-enable svelte/prefer-svelte-reactivity */

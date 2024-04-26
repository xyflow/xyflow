import {
  infiniteExtent,
  ConnectionMode,
  adoptUserNodes,
  getViewportForBounds,
  Transform,
  updateConnectionLookup,
  devWarn,
  getInternalNodesBounds,
  PanZoomInstance,
  SelectionRect,
  OnError,
  initialConnection,
  ConnectionState,
  NodeOrigin,
  CoordinateExtent,
  withResolvers,
  OnMove,
  OnMoveStart,
  OnMoveEnd,
} from '@xyflow/system';

import {
  FitViewOptions,
  type Edge,
  type InternalNode,
  type Node,
  type SolidFlowStore,
  OnSelectionChangeFunc,
} from '../types';
import { Signal, createSignal } from 'solid-js';
import { ReactiveMap } from '@solid-primitives/map';
import { createStore, SetStoreFunction, Store as SolidStore } from 'solid-js/store';

const getInitialState = ({
  nodes,
  edges,
  defaultNodes,
  defaultEdges,
  width,
  height,
  fitView,
  fitViewOptions,
  minZoom = 0.5,
  maxZoom = 2,
  nodeOrigin,
  nodeExtent,
}: {
  nodes?: Node[];
  edges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
  fitViewOptions?: FitViewOptions;
  minZoom?: number;
  maxZoom?: number;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
} = {}): SolidFlowStore => {
  const nodeLookup = new Map<string, InternalNode>();
  const parentLookup = new Map();
  const connectionLookup = new Map();
  const edgeLookup = new Map();

  const storeEdges = defaultEdges ?? edges ?? [];
  const storeNodes = defaultNodes ?? nodes ?? [];
  const storeNodeOrigin = nodeOrigin ?? [0, 0];
  const storeNodeExtent = nodeExtent ?? infiniteExtent;

  updateConnectionLookup(connectionLookup, edgeLookup, storeEdges);
  const nodesInitialized = adoptUserNodes(storeNodes, nodeLookup, parentLookup, {
    nodeOrigin: storeNodeOrigin,
    nodeExtent: storeNodeExtent,
    elevateNodesOnSelect: false,
  });

  let transform: Transform = [0, 0, 1];

  if (fitView && width && height) {
    const bounds = getInternalNodesBounds(nodeLookup, {
      filter: (node) => !!((node.width || node.initialWidth) && (node.height || node.initialHeight)),
    });

    const { x, y, zoom } = getViewportForBounds(
      bounds,
      width,
      height,
      minZoom,
      maxZoom,
      fitViewOptions?.padding ?? 0.1
    );
    transform = [x, y, zoom];
  }

  return {
    rfId: new Writable('1'),
    width: new Writable(width ?? 0),
    height: new Writable(height ?? 0),
    transform: new Writable(transform),
    nodes: new Writable(storeNodes),
    nodesInitialized: new Writable(nodesInitialized),
    nodeLookup: new ReactiveMap(),
    parentLookup: new ReactiveMap(),
    edges: new Writable(storeEdges),
    edgeLookup: new ReactiveMap(),
    connectionLookup: new ReactiveMap(),
    onNodesChange: wNullable(),
    onEdgesChange: wNullable(),
    hasDefaultNodes: new Writable(defaultNodes !== undefined),
    hasDefaultEdges: new Writable(defaultEdges !== undefined),
    panZoom: new Writable<PanZoomInstance | null>(null),
    minZoom: new Writable(minZoom),
    maxZoom: new Writable(maxZoom),
    translateExtent: new Writable(infiniteExtent),
    nodeExtent: new Writable(storeNodeExtent),
    nodesSelectionActive: new Writable(false),
    userSelectionActive: new Writable(false),
    userSelectionRect: new Writable<SelectionRect | null>(null),
    connection: new ReactiveStore<ConnectionState<InternalNode>>({ ...initialConnection }, 'connection'),
    connectionMode: new Writable<ConnectionMode>(ConnectionMode.Strict),
    domNode: new Writable<HTMLDivElement | null>(null),
    paneDragging: new Writable(false, 'paneDragging'),
    noPanClassName: new Writable('nopan'),
    nodeOrigin: new Writable(storeNodeOrigin),
    nodeDragThreshold: new Writable(1),

    snapGrid: new Writable([15, 15]),
    snapToGrid: new Writable(false),

    nodesDraggable: new Writable(true),
    nodesConnectable: new Writable(true),
    nodesFocusable: new Writable(true),
    edgesFocusable: new Writable(true),
    edgesReconnectable: new Writable(true),
    elementsSelectable: new Writable(true),
    elevateNodesOnSelect: new Writable(true),
    elevateEdgesOnSelect: new Writable(false),
    selectNodesOnDrag: new Writable(true),

    multiSelectionActive: new Writable(false),

    connectionClickStartHandle: wNullable(),
    connectOnClick: w(true),

    ariaLiveMessage: w(''),
    autoPanOnConnect: w(true),
    autoPanOnNodeDrag: w(true),
    autoPanSpeed: w(15),
    connectionRadius: w(20),
    onError: w<OnError | undefined>(devWarn),
    isValidConnection: undefined,
    onSelectionChangeHandlers: w<OnSelectionChangeFunc[]>([]),

    onConnect: wEmpty(),

    onDelete: wEmpty(),
    onEdgesDelete: wEmpty(),
    onNodesDelete: wEmpty(),

    onBeforeDelete: wEmpty(),
    onViewportChange: wEmpty(),
    onViewportChangeEnd: wEmpty(),
    onViewportChangeStart: wEmpty(),

    onMoveStart: wEmpty<OnMoveStart>(),
    onMove: wEmpty<OnMove>(),
    onMoveEnd: wEmpty<OnMoveEnd>(),

    lib: new Writable('solid'),
    debug: new Writable(false),

    // New properties for React compatibility
    fitViewQueued: new Writable(fitView ?? false),
    fitViewOptions: new Writable<FitViewOptions | undefined>(fitViewOptions),
    fitViewResolver: wNullable<ReturnType<typeof withResolvers<boolean>>>(),
  };
};

export default getInitialState;

const w = <T>(x: T) => new Writable<T>(x);
const wEmpty = <T>() => new Writable<T | undefined>(undefined);
const wNullable = <T>() => new Writable<T | null>(null);

export class Writable<T> {
  private s: Signal<T>;

  constructor(initial: T, private debugName?: string) {
    this.s = createSignal(initial, {
      name: debugName,
    });
  }

  get = () => {
    const value = this.s[0]();
    return value;
  };

  set = (v: T) => {
    this.s[1](() => {
      return v;
    });
  };

  setFromPrev = (fn: (prev: T) => T) => {
    this.s[1]((prev: T) => {
      const newValue = fn(prev);
      return newValue;
    });
  };
}

export class ReactiveStore<T extends object> {
  private store: ReturnType<typeof createStore<T>>;

  constructor(initial: T, private debugName?: string) {
    this.store = createStore(initial);
  }

  get = (): T => {
    const value = this.store[0];
    return value;
  };

  setter = (): SetStoreFunction<T> => {
    return this.store[1];
  };
}

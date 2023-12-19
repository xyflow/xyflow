import {
  writable,
  get,
  type Unsubscriber,
  type Subscriber,
  type Updater,
  type Writable
} from 'svelte/store';
import {
  adoptUserProvidedNodes,
  updateConnectionLookup,
  type Viewport,
  type PanZoomInstance,
  type ConnectionLookup,
  type EdgeLookup,
  type NodeLookup
} from '@xyflow/system';

import type { DefaultEdgeOptions, DefaultNodeOptions, Edge, Node } from '$lib/types';

// we need to sync the user nodes and the internal nodes so that the user can receive the updates
// made by Svelte Flow (like dragging or selecting a node).
export function syncNodeStores(
  nodesStore: ReturnType<typeof createNodesStore>,
  userNodesStore: Writable<Node[]>
) {
  const nodesStoreSetter = nodesStore.set;
  const userNodesStoreSetter = userNodesStore.set;
  const currentNodesStore = get(nodesStore);
  const currentUserNodesStore = get(userNodesStore);
  // depending how the user initializes the nodes, we need to decide if we want to use
  // the user nodes or the internal nodes for initialization. A user can use a SvelteFlowProvider
  // without providing any nodes, in that case we want to use the nodes passed by the user.
  // By default we are using the store nodes, because they already have the absolute positions.
  const initWithUserNodes = currentNodesStore.length === 0 && currentUserNodesStore.length > 0;

  let val = initWithUserNodes ? currentUserNodesStore : currentNodesStore;
  nodesStore.set(val);

  const _set = (nds: Node[]) => {
    const updatedNodes = nodesStoreSetter(nds);
    val = updatedNodes;

    userNodesStoreSetter(val);

    return updatedNodes;
  };

  nodesStore.set = userNodesStore.set = _set;
  nodesStore.update = userNodesStore.update = (fn: (nds: Node[]) => Node[]) => _set(fn(val));
}

// same for edges
export function syncEdgeStores(
  edgesStore: ReturnType<typeof createEdgesStore>,
  userEdgesStore: Writable<Edge[]>
) {
  const nodesStoreSetter = edgesStore.set;
  const userEdgesStoreSetter = userEdgesStore.set;

  let val = get(userEdgesStore);
  edgesStore.set(val);

  const _set = (eds: Edge[]) => {
    nodesStoreSetter(eds);
    userEdgesStoreSetter(eds);
    val = eds;
  };

  edgesStore.set = userEdgesStore.set = _set;
  edgesStore.update = userEdgesStore.update = (fn: (nds: Edge[]) => Edge[]) => _set(fn(val));
}

// it is possible to pass a viewport store to SvelteFlow for having more control
// if that's the case we need to sync the internal viewport with the user viewport
export const syncViewportStores = (
  panZoomStore: Writable<PanZoomInstance | null>,
  viewportStore: Writable<Viewport>,
  userViewportStore?: Writable<Viewport>
) => {
  if (!userViewportStore) {
    return;
  }

  const panZoom = get(panZoomStore);

  const viewportStoreSetter = viewportStore.set;
  const userViewportStoreSetter = userViewportStore.set;

  let val = userViewportStore ? get(userViewportStore) : { x: 0, y: 0, zoom: 1 };
  viewportStore.set(val);

  viewportStore.set = (vp: Viewport) => {
    viewportStoreSetter(vp);
    userViewportStoreSetter(vp);

    val = vp;

    return vp;
  };

  userViewportStore.set = (vp: Viewport) => {
    panZoom?.syncViewport(vp);

    viewportStoreSetter(vp);
    userViewportStoreSetter(vp);

    val = vp;

    return vp;
  };

  viewportStore.update = (fn: (vp: Viewport) => Viewport) => {
    viewportStore.set(fn(val));
  };

  userViewportStore.update = (fn: (vp: Viewport) => Viewport) => {
    userViewportStore.set(fn(val));
  };
};

export type NodeStoreOptions = {
  elevateNodesOnSelect?: boolean;
};

// we are creating a custom store for the internals nodes in order to update the zIndex and positionAbsolute.
// The user only passes in relative positions, so we need to calculate the absolute positions based on the parent nodes.
export const createNodesStore = (
  nodes: Node[],
  nodeLookup: NodeLookup<Node>
): {
  subscribe: (this: void, run: Subscriber<Node[]>) => Unsubscriber;
  update: (this: void, updater: Updater<Node[]>) => void;
  set: (this: void, value: Node[]) => Node[];
  setDefaultOptions: (opts: DefaultNodeOptions) => void;
  setOptions: (opts: NodeStoreOptions) => void;
} => {
  const { subscribe, set, update } = writable<Node[]>([]);
  let value = nodes;
  let defaults = {};
  let elevateNodesOnSelect = true;

  const _set = (nds: Node[]): Node[] => {
    const nextNodes = adoptUserProvidedNodes(nds, nodeLookup, {
      elevateNodesOnSelect,
      defaults
    });

    value = nextNodes;

    set(value);

    return value;
  };

  const _update: typeof update = (fn: (nds: Node[]) => Node[]) => _set(fn(value));

  const setDefaultOptions = (options: DefaultNodeOptions) => {
    defaults = options;
  };

  const setOptions = (options: NodeStoreOptions) => {
    elevateNodesOnSelect = options.elevateNodesOnSelect ?? elevateNodesOnSelect;
  };

  _set(value);

  return {
    subscribe,
    set: _set,
    update: _update,
    setDefaultOptions,
    setOptions
  };
};

export const createEdgesStore = (
  edges: Edge[],
  connectionLookup: ConnectionLookup,
  edgeLookup: EdgeLookup<Edge>,
  defaultOptions?: DefaultEdgeOptions
): Writable<Edge[]> & { setDefaultOptions: (opts: DefaultEdgeOptions) => void } => {
  const { subscribe, set, update } = writable<Edge[]>([]);
  let value = edges;
  let defaults = defaultOptions || {};

  const _set: typeof set = (eds: Edge[]) => {
    const nextEdges = defaults ? eds.map((edge) => ({ ...defaults, ...edge })) : eds;

    updateConnectionLookup(connectionLookup, edgeLookup, nextEdges);

    value = nextEdges;
    set(value);
  };

  const _update: typeof update = (fn: (eds: Edge[]) => Edge[]) => _set(fn(value));

  const setDefaultOptions = (options: DefaultEdgeOptions) => {
    defaults = options;
  };

  _set(value);

  return {
    subscribe,
    set: _set,
    update: _update,
    setDefaultOptions
  };
};

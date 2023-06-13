import {
  writable,
  type Unsubscriber,
  type Subscriber,
  type Updater,
  type Writable,
  get
} from 'svelte/store';
import { updateNodes } from '@xyflow/system';

import type { DefaultEdgeOptions, DefaultNodeOptions, Edge, Node } from '$lib/types';

// we need to sync the user nodes and the internal nodes so that the user can receive the updates
// made by Svelte Flow (like dragging or selecting a node).
export function syncNodeStores(
  nodesStore: ReturnType<typeof createNodesStore>,
  userNodesStore: Writable<Node[]>
) {
  const nodesStoreSetter = nodesStore.set;
  const userNodesStoreSetter = userNodesStore.set;

  let val = get(userNodesStore);
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

export type NodeStoreOptions = {
  elevateNodesOnSelect?: boolean;
};

// we are creating a custom store for the internals nodes in order to update the zIndex and positionAbsolute.
// The user only passes in relative positions, so we need to calculate the absolute positions based on the parent nodes.
export const createNodesStore = (
  nodes: Node[]
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
  let elevateNodesOnSelect = false;

  const _set = (nds: Node[]): Node[] => {
    const nextNodes = updateNodes(nds, value, {
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
  defaultOptions?: DefaultEdgeOptions
): Writable<Edge[]> & { setDefaultOptions: (opts: DefaultEdgeOptions) => void } => {
  const { subscribe, set, update } = writable<Edge[]>([]);
  let value = edges;
  let defaults = defaultOptions || {};

  const _set: typeof set = (eds: Edge[]) => {
    const nextEdges = defaults ? eds.map((edge) => ({ ...defaults, ...edge })) : eds;
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

import {
  writable,
  type Unsubscriber,
  type Subscriber,
  type Updater,
  type Writable,
  get
} from 'svelte/store';
import {
  isNumeric,
  getNodePositionWithOrigin,
  internalsSymbol,
  type XYZPosition
} from '@xyflow/system';

import type { DefaultEdgeOptions, DefaultNodeOptions, Edge, Node } from '$lib/types';

export function syncNodeStores(
  nodesStore: ReturnType<typeof createNodes>,
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

export function syncEdgeStores(
  edgesStore: ReturnType<typeof createEdges>,
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

export const createNodes = (
  nodes: Node[]
): {
  subscribe: (this: void, run: Subscriber<Node[]>) => Unsubscriber;
  update: (this: void, updater: Updater<Node[]>) => void;
  set: (this: void, value: Node[]) => Node[];
  setDefaultOptions: (opts: DefaultNodeOptions) => void;
} => {
  const { subscribe, set, update } = writable<Node[]>([]);
  let value = nodes;
  let defaults = {};

  const _set = (nds: Node[]): Node[] => {
    const parentNodes: Record<string, boolean> = {};

    const nextNodes = nds.map((n) => {
      const node: Node = { ...defaults, ...n, positionAbsolute: n.position };
      const z = (isNumeric(node.zIndex) ? node.zIndex : 0) + (node.selected ? 1 : 0);

      if (node.parentNode) {
        parentNodes[node.parentNode] = true;
      }

      Object.defineProperty(node, internalsSymbol, {
        value: {
          handleBounds: node?.[internalsSymbol]?.handleBounds,
          z
        }
      });

      return node;
    });

    const nodesWithPositions = nextNodes.map((node) => {
      if (node.parentNode && !parentNodes[node.parentNode]) {
        throw new Error(`Parent node ${node.parentNode} not found`);
      }

      if (node.parentNode || parentNodes?.[node.id]) {
        const { x, y, z } = calculateXYZPosition(node, nextNodes, {
          ...node.position,
          z: node[internalsSymbol]?.z ?? 0
        });

        node.positionAbsolute = {
          x,
          y
        };

        node[internalsSymbol]!.z = z;

        if (parentNodes?.[node.id]) {
          node[internalsSymbol]!.isParent = true;
        }
      }

      return node;
    });

    value = nodesWithPositions;

    set(value);

    return value;
  };

  const _update: typeof update = (fn: (nds: Node[]) => Node[]) => _set(fn(value));

  const setDefaultOptions = (options: DefaultNodeOptions) => {
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

export const createEdges = (
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

function calculateXYZPosition(node: Node, nodes: Node[], result: XYZPosition): XYZPosition {
  if (!node.parentNode) {
    return result;
  }
  const parentNode = nodes.find((n) => n.id === node.parentNode)!;
  const parentNodePosition = getNodePositionWithOrigin(parentNode, parentNode?.origin);

  return calculateXYZPosition(parentNode, nodes, {
    x: (result.x ?? 0) + parentNodePosition.x,
    y: (result.y ?? 0) + parentNodePosition.y,
    z:
      (parentNode[internalsSymbol]?.z ?? 0) > (result.z ?? 0)
        ? parentNode[internalsSymbol]?.z ?? 0
        : result.z ?? 0
  });
}

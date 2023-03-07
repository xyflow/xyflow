import type { HandleElement, Position } from '@reactflow/system';
import {
  isNodeBase,
  isEdgeBase,
  addEdgeBase,
  getOutgoersBase,
  getIncomersBase,
  updateEdgeBase,
  getConnectedEdgesBase,
  getDimensions
} from '@reactflow/utils';
import type { DefaultEdgeOptions, DefaultNodeOptions, Edge, Node } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

export const isNode = isNodeBase<Node, Edge>;
export const isEdge = isEdgeBase<Node, Edge>;
export const getOutgoers = getOutgoersBase<Node, Edge>;
export const getIncomers = getIncomersBase<Node, Edge>;
export const addEdge = addEdgeBase<Edge>;
export const updateEdge = updateEdgeBase<Edge>;
export const getConnectedEdges = getConnectedEdgesBase<Node, Edge>;

export const getHandleBounds = (
  selector: string,
  nodeElement: HTMLDivElement,
  zoom: number
): HandleElement[] | null => {
  const handles = nodeElement.querySelectorAll(selector);

  if (!handles || !handles.length) {
    return null;
  }

  const handlesArray = Array.from(handles) as HTMLDivElement[];
  const nodeBounds = nodeElement.getBoundingClientRect();

  return handlesArray.map((handle): HandleElement => {
    const handleBounds = handle.getBoundingClientRect();

    return {
      id: handle.getAttribute('data-handleid'),
      position: handle.getAttribute('data-handlepos') as unknown as Position,
      x: (handleBounds.left - nodeBounds.left) / zoom,
      y: (handleBounds.top - nodeBounds.top) / zoom,
      ...getDimensions(handle)
    };
  });
};

export const createNodes = (
  nodes: Node[],
  defaultOptions?: DefaultNodeOptions
): Writable<Node[]> & { setDefaultOptions: (opts: DefaultNodeOptions) => void } => {
  const { subscribe, set, update } = writable<Node[]>([]);
  let value = nodes;
  let defaults = defaultOptions || {};

  const _set: typeof set = (nds: Node[]) => {
    const nextNodes = defaults ? nds.map((node) => ({ ...defaults, ...node })) : nds;
    // @todo calculate absolute position based on parent / child relation
    const nextNodesLayouted = nextNodes.map((n) => ({ ...n, positionAbsolute: n.position }));

    value = nextNodesLayouted;

    set(value);
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

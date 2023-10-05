import { get, type Writable } from 'svelte/store';
import {
  getIncomersBase,
  getOutgoersBase,
  pointToRendererPoint,
  type Project,
  type SetCenterOptions,
  type Viewport,
  type ViewportHelperFunctionOptions,
  type XYPosition,
  type ZoomInOut
} from '@xyflow/system';

import { useStore } from '$lib/store';
import type { Edge, FitViewOptions, Node } from '$lib/types';
import type { SvelteFlowStore } from '$lib/store/types';

export function useSvelteFlow(): {
  zoomIn: ZoomInOut;
  zoomOut: ZoomInOut;
  setZoom: (zoomLevel: number, options?: ViewportHelperFunctionOptions) => void;
  getZoom: () => number;
  setCenter: (x: number, y: number, options?: SetCenterOptions) => void;
  setViewport: (viewport: Viewport, options?: ViewportHelperFunctionOptions) => void;
  getViewport: () => Viewport;
  fitView: (options?: FitViewOptions) => void;
  project: Project;
  viewport: Writable<Viewport>;
  nodes: SvelteFlowStore['nodes'];
  edges: SvelteFlowStore['edges'];
  getConnectedEdges: (id: string | (Partial<Node> & { id: Node['id'] })[]) => Edge[];
  getIncomers: (node: string | (Partial<Node> & { id: Node['id'] })) => Node[];
  getOutgoers: (node: string | (Partial<Node> & { id: Node['id'] })) => Node[];
} {
  const {
    zoomIn,
    zoomOut,
    fitView,
    snapGrid,
    viewport,
    width,
    height,
    maxZoom,
    panZoom,
    nodes,
    edges
  } = useStore();

  return {
    zoomIn,
    zoomOut,
    setZoom: (zoomLevel, options) => {
      get(panZoom)?.scaleTo(zoomLevel, { duration: options?.duration });
    },
    getZoom: () => get(viewport).zoom,
    setViewport: (vieport, options) => {
      const currentViewport = get(viewport);

      get(panZoom)?.setViewport(
        {
          x: vieport.x ?? currentViewport.x,
          y: vieport.y ?? currentViewport.y,
          zoom: vieport.zoom ?? currentViewport.zoom
        },
        { duration: options?.duration }
      );
    },
    getViewport: () => get(viewport),
    setCenter: (x, y, options) => {
      const _width = get(width);
      const _height = get(height);
      const _maxZoom = get(maxZoom);

      const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : _maxZoom;

      get(panZoom)?.setViewport(
        {
          x: _width / 2 - x * nextZoom,
          y: _height / 2 - y * nextZoom,
          zoom: nextZoom
        },
        { duration: options?.duration }
      );
    },
    fitView,
    project: (position: XYPosition) => {
      const _snapGrid = get(snapGrid);
      const { x, y, zoom } = get(viewport);

      return pointToRendererPoint(position, [x, y, zoom], _snapGrid !== null, _snapGrid || [1, 1]);
    },
    nodes,
    edges,
    getConnectedEdges: (node) => {
      const _edges = get(edges);

      const nodeIds = new Set();
      if (typeof node === 'string') {
        nodeIds.add(node);
      } else if (node.length >= 1) {
        node.forEach((n) => {
          nodeIds.add(n.id);
        });
      }

      return _edges.filter((edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target));
    },
    getIncomers: (node) => {
      const _edges = get(edges);
      const _nodes = get(nodes);

      if (typeof node === 'string') {
        return getIncomersBase({ id: node }, _nodes, _edges);
      }

      return getIncomersBase(node, _nodes, _edges);
    },
    getOutgoers: (node) => {
      const _edges = get(edges);
      const _nodes = get(nodes);

      if (typeof node == 'string') {
        return getOutgoersBase({ id: node }, _nodes, _edges);
      }

      return getOutgoersBase(node, _nodes, _edges);
    },
    viewport: viewport
  };
}

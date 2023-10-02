import { get, type Writable } from 'svelte/store';
import {
  getOverlappingArea,
  isRectObject,
  nodeToRect,
  pointToRendererPoint,
  type Project,
  type Rect,
  type SetCenterOptions,
  type Viewport,
  type ViewportHelperFunctionOptions,
  type XYPosition,
  type ZoomInOut
} from '@xyflow/system';

import { useStore } from '$lib/store';
import type { FitViewOptions, Node } from '$lib/types';
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
  getIntersectingNodes: (
    nodeOrRect: (Partial<Node<any>> & { id: Node['id'] }) | Rect,
    partially?: boolean,
    nodesToIntersect?: Node[]
  ) => Node[];
  isNodeIntersecting: (
    nodeOrRect: (Partial<Node<any>> & { id: Node['id'] }) | Rect,
    area: Rect,
    partially?: boolean
  ) => boolean;
  project: Project;
  viewport: Writable<Viewport>;
  nodes: SvelteFlowStore['nodes'];
  edges: SvelteFlowStore['edges'];
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

  const getNodeRect = (
    nodeOrRect: (Partial<Node<any>> & { id: Node['id'] }) | Rect
  ): [Rect | null, Node<any> | null | undefined, boolean] => {
    const isRect = isRectObject(nodeOrRect);
    const node = isRect ? null : get(nodes).find((n) => n.id === nodeOrRect.id);

    if (!isRect && !node) {
      [null, null, isRect];
    }

    const nodeRect = isRect ? nodeOrRect : nodeToRect(node!);

    return [nodeRect, node, isRect];
  };

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
    getIntersectingNodes: (
      nodeOrRect: (Partial<Node<any>> & { id: Node['id'] }) | Rect,
      partially = true,
      nodesToIntersect?: Node[]
    ) => {
      const [nodeRect, node, isRect] = getNodeRect(nodeOrRect);

      if (!nodeRect) {
        return [];
      }

      return (nodesToIntersect || get(nodes)).filter((n) => {
        if (!isRect && (n.id === node!.id || !n.positionAbsolute)) {
          return false;
        }

        const currNodeRect = nodeToRect(n);
        const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
        const partiallyVisible = partially && overlappingArea > 0;

        return partiallyVisible || overlappingArea >= nodeOrRect.width! * nodeOrRect.height!;
      });
    },
    isNodeIntersecting: (
      nodeOrRect: (Partial<Node<any>> & { id: Node['id'] }) | Rect,
      area: Rect,
      partially = true
    ) => {
      const [nodeRect] = getNodeRect(nodeOrRect);

      if (!nodeRect) {
        return false;
      }

      const overlappingArea = getOverlappingArea(nodeRect, area);
      const partiallyVisible = partially && overlappingArea > 0;

      return partiallyVisible || overlappingArea >= nodeOrRect.width! * nodeOrRect.height!;
    },
    project: (position: XYPosition) => {
      const _snapGrid = get(snapGrid);
      const { x, y, zoom } = get(viewport);

      return pointToRendererPoint(position, [x, y, zoom], _snapGrid !== null, _snapGrid || [1, 1]);
    },
    nodes,
    edges,
    viewport: viewport
  };
}

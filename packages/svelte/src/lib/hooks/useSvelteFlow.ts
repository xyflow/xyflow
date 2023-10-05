import { get, type Writable } from 'svelte/store';
import {
  getOverlappingArea,
  isRectObject,
  nodeToRect,
  pointToRendererPoint,
  type FitBoundsOptions,
  type SetCenterOptions,
  type Viewport,
  type ViewportHelperFunctionOptions,
  type XYPosition,
  type ZoomInOut,
  type Rect,
  getTransformForBounds,
  getElementsToRemove,
  rendererPointToPoint
} from '@xyflow/system';

import { useStore } from '$lib/store';
import type { Edge, FitViewOptions, Node } from '$lib/types';

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
    nodeOrRect: (Partial<Node> & { id: Node['id'] }) | Rect,
    partially?: boolean,
    nodesToIntersect?: Node[]
  ) => Node[];
  isNodeIntersecting: (
    nodeOrRect: (Partial<Node> & { id: Node['id'] }) | Rect,
    area: Rect,
    partially?: boolean
  ) => boolean;
  fitBounds: (bounds: Rect, options?: FitBoundsOptions) => void;
  deleteElements: (
    nodesToRemove?: Partial<Node> & { id: string }[],
    edgesToRemove?: Partial<Edge> & { id: string }[]
  ) => { deletedNodes: Node[]; deletedEdges: Edge[] };
  screenToFlowCoordinate: (position: XYPosition) => XYPosition;
  flowToScreenCoordinate: (position: XYPosition) => XYPosition;
  viewport: Writable<Viewport>;
} {
  const {
    zoomIn,
    zoomOut,
    fitView,
    snapGrid,
    viewport,
    width,
    height,
    minZoom,
    maxZoom,
    panZoom,
    nodes,
    edges,
    domNode
  } = useStore();

  const getNodeRect = (
    nodeOrRect: (Partial<Node> & { id: Node['id'] }) | Rect
  ): [Rect | null, Node | null | undefined, boolean] => {
    const isRect = isRectObject(nodeOrRect);
    const node = isRect ? null : get(nodes).find((n) => n.id === nodeOrRect.id);

    if (!isRect && !node) {
      return [null, null, isRect];
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
    fitBounds: (bounds: Rect, options?: FitBoundsOptions) => {
      const _width = get(width);
      const _height = get(height);
      const _maxZoom = get(maxZoom);
      const _minZoom = get(minZoom);

      const [x, y, zoom] = getTransformForBounds(
        bounds,
        _width,
        _height,
        _minZoom,
        _maxZoom,
        options?.padding ?? 0.1
      );

      get(panZoom)?.setViewport(
        {
          x,
          y,
          zoom
        },
        { duration: options?.duration }
      );
    },
    getIntersectingNodes: (
      nodeOrRect: (Partial<Node> & { id: Node['id'] }) | Rect,
      partially = true,
      nodesToIntersect?: Node[]
    ) => {
      const [nodeRect, node, isRect] = getNodeRect(nodeOrRect);

      if (!nodeRect || !node) {
        return [];
      }

      return (nodesToIntersect || get(nodes)).filter((n) => {
        if (!isRect && (n.id === node.id || !n.positionAbsolute)) {
          return false;
        }

        const currNodeRect = nodeToRect(n);
        const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
        const partiallyVisible = partially && overlappingArea > 0;

        return partiallyVisible || overlappingArea >= nodeOrRect.width! * nodeOrRect.height!;
      });
    },
    isNodeIntersecting: (
      nodeOrRect: (Partial<Node> & { id: Node['id'] }) | Rect,
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
    deleteElements: (
      nodesToRemove: Partial<Node> & { id: string }[] = [],
      edgesToRemove: Partial<Edge> & { id: string }[] = []
    ) => {
      const _nodes = get(nodes);
      const _edges = get(edges);
      const { matchingNodes, matchingEdges } = getElementsToRemove<Node, Edge>({
        nodesToRemove,
        edgesToRemove,
        nodes: _nodes,
        edges: _edges
      });

      if (matchingNodes) {
        nodes.set(_nodes.filter((node) => !matchingNodes.some(({ id }) => id === node.id)));
      }

      if (matchingEdges) {
        edges.set(_edges.filter((edge) => !matchingEdges.some(({ id }) => id === edge.id)));
      }

      return {
        deletedNodes: matchingNodes,
        deletedEdges: matchingEdges
      };
    },
    screenToFlowCoordinate: (position: XYPosition) => {
      const _domNode = get(domNode);
      if (_domNode) {
        const _snapGrid = get(snapGrid);
        const { x, y, zoom } = get(viewport);
        const { x: domX, y: domY } = _domNode.getBoundingClientRect();

        const correctedPosition = {
          x: position.x - domX,
          y: position.y - domY
        };

        return pointToRendererPoint(
          correctedPosition,
          [x, y, zoom],
          _snapGrid !== null,
          _snapGrid || [1, 1]
        );
      }

      return { x: 0, y: 0 };
    },
    flowToScreenCoordinate: (position: XYPosition) => {
      const _domNode = get(domNode);
      if (_domNode) {
        const { x, y, zoom } = get(viewport);
        const { x: domX, y: domY } = _domNode.getBoundingClientRect();

        const rendererPosition = rendererPointToPoint(position, [x, y, zoom]);

        return {
          x: rendererPosition.x + domX,
          y: rendererPosition.y + domY
        };
      }

      return { x: 0, y: 0 };
    },
    viewport: viewport
  };
}

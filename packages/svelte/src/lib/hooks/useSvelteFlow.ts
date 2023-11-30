import { get, type Writable } from 'svelte/store';
import {
  getIncomersBase,
  getOutgoersBase,
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
  getViewportForBounds,
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
    nodeOrRect: Node | { id: Node['id'] } | Rect,
    partially?: boolean,
    nodesToIntersect?: Node[]
  ) => Node[];
  isNodeIntersecting: (
    nodeOrRect: Node | { id: Node['id'] } | Rect,
    area: Rect,
    partially?: boolean
  ) => boolean;
  fitBounds: (bounds: Rect, options?: FitBoundsOptions) => void;
  deleteElements: (
    nodesToRemove?: (Node | { id: Node['id'] })[],
    edgesToRemove?: (Edge | { id: Edge['id'] })[]
  ) => { deletedNodes: Node[]; deletedEdges: Edge[] };
  screenToFlowPosition: (position: XYPosition) => XYPosition;
  flowToScreenPosition: (position: XYPosition) => XYPosition;
  viewport: Writable<Viewport>;
  getConnectedEdges: (id: string | (Node | { id: Node['id'] })[]) => Edge[];
  getIncomers: (node: string | Node | { id: Node['id'] }) => Node[];
  getOutgoers: (node: string | Node | { id: Node['id'] }) => Node[];
  toObject: () => { nodes: Node[]; edges: Edge[]; viewport: Viewport };
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
    nodeOrRect: Node | { id: Node['id'] } | Rect
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
      const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : get(maxZoom);

      get(panZoom)?.setViewport(
        {
          x: get(width) / 2 - x * nextZoom,
          y: get(height) / 2 - y * nextZoom,
          zoom: nextZoom
        },
        { duration: options?.duration }
      );
    },
    fitView,
    fitBounds: (bounds: Rect, options?: FitBoundsOptions) => {
      const viewport = getViewportForBounds(
        bounds,
        get(width),
        get(height),
        get(minZoom),
        get(maxZoom),
        options?.padding ?? 0.1
      );

      get(panZoom)?.setViewport(viewport, { duration: options?.duration });
    },
    getIntersectingNodes: (
      nodeOrRect: Node | { id: Node['id'] } | Rect,
      partially = true,
      nodesToIntersect?: Node[]
    ) => {
      const [nodeRect, node, isRect] = getNodeRect(nodeOrRect);

      if (!nodeRect) {
        return [];
      }

      return (nodesToIntersect || get(nodes)).filter((n) => {
        if (!isRect && (n.id === node!.id || !n.computed?.positionAbsolute)) {
          return false;
        }

        const currNodeRect = nodeToRect(n);
        const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
        const partiallyVisible = partially && overlappingArea > 0;

        return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
      });
    },
    isNodeIntersecting: (
      nodeOrRect: Node | { id: Node['id'] } | Rect,
      area: Rect,
      partially = true
    ) => {
      const [nodeRect] = getNodeRect(nodeOrRect);

      if (!nodeRect) {
        return false;
      }

      const overlappingArea = getOverlappingArea(nodeRect, area);
      const partiallyVisible = partially && overlappingArea > 0;

      return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
    },
    deleteElements: (
      nodesToRemove: (Node | { id: Node['id'] })[] = [],
      edgesToRemove: (Edge | { id: Edge['id'] })[] = []
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
    screenToFlowPosition: (position: XYPosition) => {
      const _domNode = get(domNode);

      if (!_domNode) {
        return position;
      }

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
    },
    flowToScreenPosition: (position: XYPosition) => {
      const _domNode = get(domNode);

      if (!_domNode) {
        return position;
      }

      const { x, y, zoom } = get(viewport);
      const { x: domX, y: domY } = _domNode.getBoundingClientRect();
      const rendererPosition = rendererPointToPoint(position, [x, y, zoom]);

      return {
        x: rendererPosition.x + domX,
        y: rendererPosition.y + domY
      };
    },
    getConnectedEdges: (node) => {
      const nodeIds = new Set();

      if (typeof node === 'string') {
        nodeIds.add(node);
      } else if (node.length >= 1) {
        node.forEach((n) => {
          nodeIds.add(n.id);
        });
      }

      return get(edges).filter((edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target));
    },
    getIncomers: (node) => {
      const _node = typeof node === 'string' ? { id: node } : node;

      return getIncomersBase(_node, get(nodes), get(edges));
    },
    getOutgoers: (node) => {
      const _node = typeof node === 'string' ? { id: node } : node;

      return getOutgoersBase(_node, get(nodes), get(edges));
    },
    toObject: () => {
      return {
        nodes: get(nodes).map((node) => ({
          ...node,
          // we want to make sure that changes to the nodes object that gets returned by toObject
          // do not affect the nodes object
          position: { ...node.position },
          data: { ...node.data }
        })),
        edges: get(edges).map((edge) => ({ ...edge })),
        viewport: { ...get(viewport) }
      };
    },
    viewport
  };
}

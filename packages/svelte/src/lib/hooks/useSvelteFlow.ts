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
  getViewportForBounds,
  getElementsToRemove,
  rendererPointToPoint
} from '@xyflow/system';

import { useStore } from '$lib/store';
import type { Edge, FitViewOptions, Node } from '$lib/types';
import { isNode } from '$lib/utils';

/**
 * Hook for accessing the ReactFlow instance.
 *
 * @public
 * @returns helper functions
 */
export function useSvelteFlow(): {
  zoomIn: ZoomInOut;
  zoomOut: ZoomInOut;
  getNode: (id: string) => Node | undefined;
  getNodes: (ids?: string[]) => (Node | undefined)[];
  getEdge: (id: string) => Edge | undefined;
  getEdges: (ids?: string[]) => (Edge | undefined)[];
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
  deleteElements: ({
    nodes,
    edges
  }: {
    nodes?: (Node | { id: Node['id'] })[];
    edges?: (Edge | { id: Edge['id'] })[];
  }) => Promise<{ deletedNodes: Node[]; deletedEdges: Edge[] }>;
  screenToFlowPosition: (position: XYPosition, options?: { snapToGrid: boolean }) => XYPosition;
  flowToScreenPosition: (position: XYPosition) => XYPosition;
  viewport: Writable<Viewport>;
  updateNode: (
    id: string,
    nodeUpdate: Partial<Node> | ((node: Node) => Partial<Node>),
    options?: { replace: boolean }
  ) => void;
  updateNodeData: (
    id: string,
    dataUpdate: object | ((node: Node) => object),
    options?: { replace: boolean }
  ) => void;
  toObject: () => { nodes: Node[]; edges: Edge[]; viewport: Viewport };
} {
  const {
    zoomIn,
    zoomOut,
    fitView,
    onbeforedelete,
    snapGrid,
    viewport,
    width,
    height,
    minZoom,
    maxZoom,
    panZoom,
    nodes,
    edges,
    domNode,
    nodeLookup,
    edgeLookup
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

  const updateNode = (
    id: string,
    nodeUpdate: Partial<Node> | ((node: Node) => Partial<Node>),
    options: { replace: boolean } = { replace: false }
  ) => {
    nodes.update((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const nextNode = typeof nodeUpdate === 'function' ? nodeUpdate(node as Node) : nodeUpdate;

          return options.replace && isNode(nextNode) ? nextNode : { ...node, ...nextNode };
        }

        return node;
      })
    );
  };

  return {
    zoomIn,
    zoomOut,
    getNode: (id) => get(nodeLookup).get(id),
    getNodes: (ids) => {
      if (!ids) {
        return get(nodes);
      }
      return ids.map((id) => get(nodeLookup).get(id));
    },
    getEdge: (id) => get(edgeLookup).get(id),
    getEdges: (ids) => {
      if (!ids) {
        return get(edges);
      }
      return ids.map((id) => get(edgeLookup).get(id));
    },
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
    deleteElements: async ({ nodes: nodesToRemove = [], edges: edgesToRemove = [] }) => {
      const { nodes: matchingNodes, edges: matchingEdges } = await getElementsToRemove({
        nodesToRemove,
        edgesToRemove,
        nodes: get(nodes),
        edges: get(edges),
        onBeforeDelete: get(onbeforedelete)
      });

      if (matchingNodes) {
        nodes.update((nds) =>
          nds.filter((node) => !matchingNodes.some(({ id }) => id === node.id))
        );
      }

      if (matchingEdges) {
        edges.update((eds) =>
          eds.filter((edge) => !matchingEdges.some(({ id }) => id === edge.id))
        );
      }

      return {
        deletedNodes: matchingNodes,
        deletedEdges: matchingEdges
      };
    },
    screenToFlowPosition: (
      position: XYPosition,
      options: { snapToGrid: boolean } = { snapToGrid: true }
    ) => {
      const _domNode = get(domNode);

      if (!_domNode) {
        return position;
      }

      const _snapGrid = options.snapToGrid ? get(snapGrid) : false;
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
    updateNode,
    updateNodeData: (id, dataUpdate, options) => {
      updateNode(id, (node) => {
        const nextData = typeof dataUpdate === 'function' ? dataUpdate(node) : dataUpdate;

        return options?.replace
          ? { ...node, data: nextData }
          : { ...node, data: { ...node.data, ...nextData } };
      });
    },
    viewport
  };
}

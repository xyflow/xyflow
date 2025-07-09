import { ComponentType } from 'react';
import {
  FitViewParamsBase,
  FitViewOptionsBase,
  ZoomInOut,
  ZoomTo,
  SetViewport,
  GetZoom,
  GetViewport,
  SetCenter,
  FitBounds,
  XYPosition,
  OnBeforeDeleteBase,
  Connection,
  NodeChange,
  EdgeChange,
} from '@xyflow/system';

import type { Node, Edge, ReactFlowInstance, EdgeProps, NodeProps } from '.';

/**
 * This type can be used to type the `onNodesChange` function with a custom node type.
 *
 * @public
 *
 * @example
 *
 * ```ts
 * const onNodesChange: OnNodesChange<MyNodeType> = useCallback((changes) => {
 *  setNodes((nodes) => applyNodeChanges(nodes, changes));
 * },[]);
 * ```
 */
export type OnNodesChange<NodeType extends Node = Node> = (changes: NodeChange<NodeType>[]) => void;

/**
 * This type can be used to type the `onEdgesChange` function with a custom edge type.
 *
 * @public
 *
 * @example
 *
 * ```ts
 * const onEdgesChange: OnEdgesChange<MyEdgeType> = useCallback((changes) => {
 *  setEdges((edges) => applyEdgeChanges(edges, changes));
 * },[]);
 * ```
 */
export type OnEdgesChange<EdgeType extends Edge = Edge> = (changes: EdgeChange<EdgeType>[]) => void;

export type OnNodesDelete<NodeType extends Node = Node> = (nodes: NodeType[]) => void;
export type OnEdgesDelete<EdgeType extends Edge = Edge> = (edges: EdgeType[]) => void;

/**
 * This type can be used to type the `onDelete` function with a custom node and edge type.
 *
 * @public
 */
export type OnDelete<NodeType extends Node = Node, EdgeType extends Edge = Edge> = (params: {
  nodes: NodeType[];
  edges: EdgeType[];
}) => void;

export type NodeTypes = Record<
  string,
  ComponentType<
    NodeProps & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: any;
    }
  >
>;

export type EdgeTypes = Record<
  string,
  ComponentType<
    EdgeProps & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: any;
    }
  >
>;

export type UnselectNodesAndEdgesParams<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  nodes?: NodeType[];
  edges?: EdgeType[];
};

export type OnSelectionChangeParams<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  nodes: NodeType[];
  edges: EdgeType[];
};

export type OnSelectionChangeFunc<NodeType extends Node = Node, EdgeType extends Edge = Edge> = (
  params: OnSelectionChangeParams<NodeType, EdgeType>
) => void;

/**
 * @inline
 */
export type FitViewParams<NodeType extends Node = Node> = FitViewParamsBase<NodeType>;

/**
 * When calling [`fitView`](/api-reference/types/react-flow-instance#fitview) these options
 * can be used to customize the behaviour. For example, the `duration` option can be used to
 * transform the viewport smoothly over a given amount of time.
 *
 * @public
 * @inline
 */
export type FitViewOptions<NodeType extends Node = Node> = FitViewOptionsBase<NodeType>;

/**
 * @inline
 */
export type FitView<NodeType extends Node = Node> = (fitViewOptions?: FitViewOptions<NodeType>) => Promise<boolean>;

/**
 * @inline
 */
export type OnInit<NodeType extends Node = Node, EdgeType extends Edge = Edge> = (
  reactFlowInstance: ReactFlowInstance<NodeType, EdgeType>
) => void;

/**
 * @inline
 */
export type ViewportHelperFunctions = {
  /**
   * Zooms viewport in by 1.2.
   *
   * @param options.duration - optional duration. If set, a transition will be applied
   */
  zoomIn: ZoomInOut;
  /**
   * Zooms viewport out by 1 / 1.2.
   *
   * @param options.duration - optional duration. If set, a transition will be applied
   */
  zoomOut: ZoomInOut;
  /**
   * Zoom the viewport to a given zoom level. Passing in a `duration` will animate the viewport to
   * the new zoom level.
   *
   * @param zoomLevel - the zoom level to set
   * @param options.duration - optional duration. If set, a transition will be applied
   */
  zoomTo: ZoomTo;
  /**
   * Get the current zoom level of the viewport.
   *
   * @returns current zoom as a number
   */
  getZoom: GetZoom;
  /**
   * Sets the current viewport.
   *
   * @param viewport - the viewport to set
   * @param options.duration - optional duration. If set, a transition will be applied
   * @param options.ease - optional ease function.
   */
  setViewport: SetViewport;
  /**
   * Returns the current viewport.
   *
   * @returns Viewport
   */
  getViewport: GetViewport;
  /**
   * Center the viewport on a given position. Passing in a `duration` will animate the viewport to
   * the new position.
   *
   * @param x - x position
   * @param y - y position
   * @param options.zoom - optional zoom
   * @param options.duration - optional duration. If set, a transition will be applied
   * @param options.ease - optional ease function.
   */
  setCenter: SetCenter;
  /**
   * A low-level utility function to fit the viewport to a given rectangle. By passing in a
   * `duration`, the viewport will animate from its current position to the new position. The
   * `padding` option can be used to add space around the bounds.
   *
   * @param bounds - the bounds ({ x: number, y: number, width: number, height: number }) to fit the view to
   * @param options.padding - optional padding
   * @param options.duration - optional duration. If set, a transition will be applied
   * @param options.ease - optional ease function.
   */
  fitBounds: FitBounds;
  /**
   * With this function you can translate a screen pixel position to a flow position. It is useful
   * for implementing drag and drop from a sidebar for example.
   *
   * @param clientPosition - the screen / client position. When you are working with events you can use event.clientX and event.clientY
   * @param options.snapToGrid - if true, the converted position will be snapped to the grid
   * @returns position as { x: number, y: number }
   *
   * @example
   * const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY })
   */
  screenToFlowPosition: (clientPosition: XYPosition, options?: { snapToGrid: boolean }) => XYPosition;
  /**
   * Translate a position inside the flow's canvas to a screen pixel position.
   *
   * @param flowPosition - the screen / client position. When you are working with events you can use event.clientX and event.clientY
   * @returns position as { x: number, y: number }
   *
   * @example
   * const clientPosition = flowToScreenPosition({ x: node.position.x, y: node.position.y })
   */
  flowToScreenPosition: (flowPosition: XYPosition) => XYPosition;
};

export type OnBeforeDelete<NodeType extends Node = Node, EdgeType extends Edge = Edge> = OnBeforeDeleteBase<
  NodeType,
  EdgeType
>;

/**
 *  This type can be used to type the `isValidConnection` function.
 *  If the function returns `true`, the connection is valid and can be created.
 */
export type IsValidConnection<EdgeType extends Edge = Edge> = (edge: EdgeType | Connection) => boolean;

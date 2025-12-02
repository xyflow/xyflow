/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  CSSProperties,
  SVGAttributes,
  ReactNode,
  MouseEvent as ReactMouseEvent,
  ComponentType,
  AriaRole,
} from 'react';
import type {
  EdgeBase,
  BezierPathOptions,
  Position,
  SmoothStepPathOptions,
  DefaultEdgeOptionsBase,
  HandleType,
  ConnectionLineType,
  Handle,
  EdgePosition,
  StepPathOptions,
  OnError,
  OnReconnect,
  FinalConnectionState,
  XYPosition,
} from '@xyflow/system';

import { EdgeTypes, InternalNode, Node } from '.';

/**
 * @inline
 */
export type EdgeLabelOptions = {
  /**
   * The label or custom element to render along the edge. This is commonly a text label or some
   * custom controls.
   */
  label?: ReactNode;
  /**
   * Custom styles to apply to the label.
   */
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
};

/**
 * An `Edge` is the complete description with everything React Flow needs
 * to know in order to render it.
 * @public
 */
export type Edge<
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeType extends string | undefined = string | undefined
> = EdgeBase<EdgeData, EdgeType> &
  EdgeLabelOptions & {
    style?: CSSProperties;
    className?: string;
    /**
     * Determines whether the edge can be updated by dragging the source or target to a new node.
     * This property will override the default set by the `edgesReconnectable` prop on the
     * `<ReactFlow />` component.
     */
    reconnectable?: boolean | HandleType;
    focusable?: boolean;
    /**
     * The ARIA role attribute for the edge, used for accessibility.
     * @default "group"
     */
    ariaRole?: AriaRole;
    /**
     * General escape hatch for adding custom attributes to the edge's DOM element.
     */
    domAttributes?: Omit<
      SVGAttributes<SVGGElement>,
      'id' | 'style' | 'className' | 'role' | 'aria-label' | 'dangerouslySetInnerHTML'
    >;
  };

type SmoothStepEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<
  EdgeData,
  'smoothstep'
> & {
  pathOptions?: SmoothStepPathOptions;
};

type BezierEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<EdgeData, 'default'> & {
  pathOptions?: BezierPathOptions;
};

type StepEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<EdgeData, 'step'> & {
  pathOptions?: StepPathOptions;
};

type StraightEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<EdgeData, 'straight'>;

export type BuiltInEdge = SmoothStepEdge | BezierEdge | StepEdge | StraightEdge;

export type EdgeMouseHandler<EdgeType extends Edge = Edge> = (event: ReactMouseEvent, edge: EdgeType) => void;

export type EdgeWrapperProps<EdgeType extends Edge = Edge> = {
  id: string;
  edgesFocusable: boolean;
  edgesReconnectable: boolean;
  elementsSelectable: boolean;
  noPanClassName: string;
  onClick?: EdgeMouseHandler<EdgeType>;
  onDoubleClick?: EdgeMouseHandler<EdgeType>;
  onReconnect?: OnReconnect<EdgeType>;
  onContextMenu?: EdgeMouseHandler<EdgeType>;
  onMouseEnter?: EdgeMouseHandler<EdgeType>;
  onMouseMove?: EdgeMouseHandler<EdgeType>;
  onMouseLeave?: EdgeMouseHandler<EdgeType>;
  reconnectRadius?: number;
  onReconnectStart?: (event: ReactMouseEvent, edge: EdgeType, handleType: HandleType) => void;
  onReconnectEnd?: (
    event: MouseEvent | TouchEvent,
    edge: EdgeType,
    handleType: HandleType,
    connectionState: FinalConnectionState
  ) => void;
  rfId?: string;
  edgeTypes?: EdgeTypes;
  onError?: OnError;
  disableKeyboardA11y?: boolean;
};

/**
 * Many properties on an [`Edge`](/api-reference/types/edge) are optional. When a new edge is created,
 * the properties that are not provided will be filled in with the default values
 * passed to the `defaultEdgeOptions` prop of the [`<ReactFlow />`](/api-reference/react-flow#defaultedgeoptions) component.
 */
export type DefaultEdgeOptions = DefaultEdgeOptionsBase<Edge>;

export type EdgeTextProps = Omit<SVGAttributes<SVGElement>, 'x' | 'y'> &
  EdgeLabelOptions & {
    /** The x position where the label should be rendered. */
    x: number;
    /** The y position where the label should be rendered. */
    y: number;
  };

/**
 * When you implement a custom edge it is wrapped in a component that enables some
 * basic functionality. The `EdgeProps` type is the props that are passed to this.
 * @public
 * @expand
 */
export type EdgeProps<EdgeType extends Edge = Edge> = Pick<
  EdgeType,
  'id' | 'type' | 'animated' | 'data' | 'style' | 'selected' | 'source' | 'target' | 'selectable' | 'deletable'
> &
  EdgePosition &
  EdgeLabelOptions & {
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
    markerStart?: string;
    markerEnd?: string;
    // @TODO: how can we get better types for pathOptions?
    pathOptions?: any;
    interactionWidth?: number;
  };

/**
 * BaseEdge component props
 * @public
 * @expand
 */
export type BaseEdgeProps = Omit<SVGAttributes<SVGPathElement>, 'd' | 'path' | 'markerStart' | 'markerEnd'> &
  EdgeLabelOptions & {
    /**
     * The width of the invisible area around the edge that the user can interact with. This is
     * useful for making the edge easier to click or hover over.
     * @default 20
     */
    interactionWidth?: number;
    /** The x position of edge label */
    labelX?: number;
    /** The y position of edge label */
    labelY?: number;
    /**
     * The SVG path string that defines the edge. This should look something like
     * `'M 0 0 L 100 100'` for a simple line. The utility functions like `getSimpleBezierEdge` can
     * be used to generate this string for you.
     */
    path: string;
    /**
     * The id of the SVG marker to use at the start of the edge. This should be defined in a
     * `<defs>` element in a separate SVG document or element. Use the format "url(#markerId)" where markerId is the id of your marker definition.
     */
    markerStart?: string;
    /**
     * The id of the SVG marker to use at the end of the edge. This should be defined in a `<defs>`
     * element in a separate SVG document or element. Use the format "url(#markerId)" where markerId is the id of your marker definition.
     */
    markerEnd?: string;
  };

/**
 * Helper type for edge components that get exported by the library
 * @public
 * @expand
 */
export type EdgeComponentProps = EdgePosition &
  EdgeLabelOptions & {
    id?: EdgeProps['id'];
    markerStart?: EdgeProps['markerStart'];
    markerEnd?: EdgeProps['markerEnd'];
    interactionWidth?: EdgeProps['interactionWidth'];
    style?: EdgeProps['style'];
    sourceHandleId?: EdgeProps['sourceHandleId'];
    targetHandleId?: EdgeProps['targetHandleId'];
  };

export type EdgeComponentWithPathOptions<PathOptions> = EdgeComponentProps & {
  pathOptions?: PathOptions;
};

/**
 * BezierEdge component props
 * @public
 * @expand
 */
export type BezierEdgeProps = EdgeComponentWithPathOptions<BezierPathOptions>;

/**
 * SmoothStepEdge component props
 * @public
 * @expand
 */
export type SmoothStepEdgeProps = EdgeComponentWithPathOptions<SmoothStepPathOptions>;

/**
 * StepEdge component props
 * @public
 * @expand
 */
export type StepEdgeProps = EdgeComponentWithPathOptions<StepPathOptions>;

/**
 * StraightEdge component props
 * @public
 * @expand
 */
export type StraightEdgeProps = Omit<EdgeComponentProps, 'sourcePosition' | 'targetPosition'>;

/**
 * SimpleBezier component props
 * @public
 * @expand
 */
export type SimpleBezierEdgeProps = EdgeComponentProps;

/**
 * If you want to render a custom component for connection lines, you can set the
 * `connectionLineComponent` prop on the [`<ReactFlow />`](/api-reference/react-flow#connection-connectionLineComponent)
 * component. The `ConnectionLineComponentProps` are passed to your custom component.
 *
 * @public
 */
export type ConnectionLineComponentProps<NodeType extends Node = Node> = {
  connectionLineStyle?: CSSProperties;
  connectionLineType: ConnectionLineType;
  /** The node the connection line originates from. */
  fromNode: InternalNode<NodeType>;
  /** The handle on the `fromNode` that the connection line originates from. */
  fromHandle: Handle;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  fromPosition: Position;
  toPosition: Position;
  /**
   * If there is an `isValidConnection` callback, this prop will be set to `"valid"` or `"invalid"`
   * based on the return value of that callback. Otherwise, it will be `null`.
   */
  connectionStatus: 'valid' | 'invalid' | null;
  toNode: InternalNode<NodeType> | null;
  toHandle: Handle | null;
  pointer: XYPosition;
};

export type ConnectionLineComponent<NodeType extends Node = Node> = ComponentType<
  ConnectionLineComponentProps<NodeType>
>;

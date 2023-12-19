/* eslint-disable @typescript-eslint/no-explicit-any */

import type { CSSProperties, HTMLAttributes, ReactNode, MouseEvent as ReactMouseEvent, ComponentType } from 'react';
import type {
  EdgeBase,
  BezierPathOptions,
  Position,
  SmoothStepPathOptions,
  DefaultEdgeOptionsBase,
  HandleType,
  Connection,
  ConnectionLineType,
  HandleElement,
  ConnectionStatus,
  EdgePosition,
  StepPathOptions,
  OnError,
} from '@xyflow/system';

import { EdgeTypes, Node } from '.';

export type EdgeLabelOptions = {
  label?: string | ReactNode;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
};

export type EdgeUpdatable = boolean | HandleType;

export type DefaultEdge<EdgeData = any> = EdgeBase<EdgeData> &
  EdgeLabelOptions & {
    style?: CSSProperties;
    className?: string;
    updatable?: EdgeUpdatable;
    focusable?: boolean;
  };

type SmoothStepEdgeType<T> = DefaultEdge<T> & {
  type: 'smoothstep';
  pathOptions?: SmoothStepPathOptions;
};

type BezierEdgeType<T> = DefaultEdge<T> & {
  type: 'default';
  pathOptions?: BezierPathOptions;
};

type StepEdgeType<T> = DefaultEdge<T> & {
  type: 'step';
  pathOptions?: StepPathOptions;
};

/**
 * The Edge type is mainly used for the `edges` that get passed to the ReactFlow component
 * @public
 */
export type Edge<T = any> = DefaultEdge<T> | SmoothStepEdgeType<T> | BezierEdgeType<T> | StepEdgeType<T>;

export type EdgeMouseHandler = (event: ReactMouseEvent, edge: Edge) => void;

export type EdgeWrapperProps = {
  id: string;
  edgesFocusable: boolean;
  edgesUpdatable: boolean;
  elementsSelectable: boolean;
  noPanClassName: string;
  onClick?: EdgeMouseHandler;
  onDoubleClick?: EdgeMouseHandler;
  sourceHandleId?: string | null;
  targetHandleId?: string | null;
  onEdgeUpdate?: OnEdgeUpdateFunc;
  onContextMenu?: EdgeMouseHandler;
  onMouseEnter?: EdgeMouseHandler;
  onMouseMove?: EdgeMouseHandler;
  onMouseLeave?: EdgeMouseHandler;
  edgeUpdaterRadius?: number;
  onEdgeUpdateStart?: (event: ReactMouseEvent, edge: Edge, handleType: HandleType) => void;
  onEdgeUpdateEnd?: (event: MouseEvent | TouchEvent, edge: Edge, handleType: HandleType) => void;
  rfId?: string;
  edgeTypes?: EdgeTypes;
  onError?: OnError;
};

export type DefaultEdgeOptions = DefaultEdgeOptionsBase<Edge>;

export type EdgeTextProps = HTMLAttributes<SVGElement> &
  EdgeLabelOptions & {
    x: number;
    y: number;
  };

/**
 * Custom edge component props
 * @public
 */
export type EdgeProps<T = any> = Pick<
  Edge<T>,
  'id' | 'animated' | 'data' | 'style' | 'selected' | 'source' | 'target'
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
 */
export type BaseEdgeProps = EdgeLabelOptions & {
  id?: string;
  interactionWidth?: number;
  labelX?: number;
  labelY?: number;
  markerStart?: string;
  markerEnd?: string;
  path: string;
  style?: CSSProperties;
};

/**
 * Helper type for edge components that get exported by the library
 * @public
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
 */
export type BezierEdgeProps = EdgeComponentWithPathOptions<BezierPathOptions>;

/**
 * SmoothStepEdge component props
 * @public
 */
export type SmoothStepEdgeProps = EdgeComponentWithPathOptions<SmoothStepPathOptions>;

/**
 * StepEdge component props
 * @public
 */
export type StepEdgeProps = EdgeComponentWithPathOptions<StepPathOptions>;

/**
 * StraightEdge component props
 * @public
 */
export type StraightEdgeProps = Omit<EdgeComponentProps, 'sourcePosition' | 'targetPosition'>;

/**
 * SimpleBezier component props
 * @public
 */
export type SimpleBezierEdgeProps = EdgeComponentProps;

export type OnEdgeUpdateFunc<T = any> = (oldEdge: Edge<T>, newConnection: Connection) => void;

export type ConnectionLineComponentProps = {
  connectionLineStyle?: CSSProperties;
  connectionLineType: ConnectionLineType;
  fromNode?: Node;
  fromHandle?: HandleElement;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  fromPosition: Position;
  toPosition: Position;
  connectionStatus: ConnectionStatus | null;
};

export type ConnectionLineComponent = ComponentType<ConnectionLineComponentProps>;

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
  Optional,
  StepPathOptions,
} from '@xyflow/system';

import { Node } from '.';

export type EdgeLabelOptions = {
  label?: string | ReactNode;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
};

export type EdgeUpdatable = boolean | HandleType;

export type DefaultEdge<EdgeData = any> = EdgeBase<EdgeData> & {
  style?: CSSProperties;
  className?: string;
  sourceNode?: Node;
  targetNode?: Node;
  updatable?: EdgeUpdatable;
} & EdgeLabelOptions;

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

export type Edge<T = any> = DefaultEdge<T> | SmoothStepEdgeType<T> | BezierEdgeType<T> | StepEdgeType<T>;

export type EdgeMouseHandler = (event: ReactMouseEvent, edge: Edge) => void;

export type WrapEdgeProps<T = any> = Omit<Edge<T>, 'sourceHandle' | 'targetHandle'> & {
  onClick?: EdgeMouseHandler;
  onEdgeDoubleClick?: EdgeMouseHandler;
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
  isFocusable: boolean;
  isUpdatable: EdgeUpdatable;
  isSelectable: boolean;
  pathOptions?: BezierPathOptions | SmoothStepPathOptions;
};

export type DefaultEdgeOptions = DefaultEdgeOptionsBase<Edge>;

export type EdgeTextProps = HTMLAttributes<SVGElement> &
  EdgeLabelOptions & {
    x: number;
    y: number;
  };

// props that get passed to a custom edge
export type EdgeProps<T = any> = Pick<
  Edge<T>,
  'id' | 'animated' | 'data' | 'style' | 'selected' | 'source' | 'target'
> &
  Pick<WrapEdgeProps, 'sourceHandleId' | 'targetHandleId' | 'interactionWidth'> &
  EdgePosition &
  EdgeLabelOptions & {
    markerStart?: string;
    markerEnd?: string;
    // @TODO: how can we get better types for pathOptions?
    pathOptions?: any;
  };

export type BaseEdgeProps = Pick<EdgeProps, 'style' | 'markerStart' | 'markerEnd' | 'interactionWidth'> &
  EdgeLabelOptions & {
    id?: string;
    labelX?: number;
    labelY?: number;
    path: string;
  };

export type EdgeComponentProps<T = any> = Optional<Omit<EdgeProps<T>, 'source' | 'target'>, 'id'>;

export type StraightEdgeProps<T = any> = EdgeComponentProps<T>;

export type SmoothStepEdgeProps<T = any> = EdgeComponentProps<T> & {
  pathOptions?: SmoothStepPathOptions;
};

export type BezierEdgeProps<T = any> = EdgeComponentProps<T> & {
  pathOptions?: BezierPathOptions;
};

export type StepEdgeProps<T = any> = EdgeComponentProps<T> & {
  pathOptions?: StepPathOptions;
};

export type SimpleBezierEdgeProps<T = any> = EdgeComponentProps<T>;

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

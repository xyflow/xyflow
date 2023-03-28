/* eslint-disable @typescript-eslint/no-explicit-any */

import type { CSSProperties, HTMLAttributes, ReactNode, MouseEvent as ReactMouseEvent, ComponentType } from 'react';
import type {
  BaseEdge,
  BezierPathOptions,
  Position,
  SmoothStepPathOptions,
  DefaultEdgeOptionsBase,
  HandleType,
  Connection,
  ConnectionLineType,
  HandleElement,
  ConnectionStatus,
} from '@reactflow/system';

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

export type DefaultEdge<EdgeData = any> = BaseEdge<EdgeData> & {
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

export type Edge<T = any> = DefaultEdge<T> | SmoothStepEdgeType<T> | BezierEdgeType<T>;

export type EdgeMouseHandler = (event: ReactMouseEvent, edge: Edge) => void;

export type WrapEdgeProps<T = any> = Omit<Edge<T>, 'sourceHandle' | 'targetHandle'> & {
  onClick?: EdgeMouseHandler;
  onEdgeDoubleClick?: EdgeMouseHandler;
  sourceHandleId?: string | null;
  targetHandleId?: string | null;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  elementsSelectable?: boolean;
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
  Pick<
    WrapEdgeProps,
    | 'sourceX'
    | 'sourceY'
    | 'targetX'
    | 'targetY'
    | 'sourcePosition'
    | 'targetPosition'
    | 'sourceHandleId'
    | 'targetHandleId'
    | 'interactionWidth'
  > &
  EdgeLabelOptions & {
    markerStart?: string;
    markerEnd?: string;
    // @TODO: how can we get better types for pathOptions?
    pathOptions?: any;
  };

export type BaseEdgeProps = Pick<EdgeProps, 'style' | 'markerStart' | 'markerEnd' | 'interactionWidth'> &
  EdgeLabelOptions & {
    labelX?: number;
    labelY?: number;
    path: string;
  };

export type SmoothStepEdgeProps<T = any> = EdgeProps<T> & {
  pathOptions?: SmoothStepPathOptions;
};

export type BezierEdgeProps<T = any> = EdgeProps<T> & {
  pathOptions?: BezierPathOptions;
};

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

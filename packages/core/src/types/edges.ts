/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties, ComponentType, HTMLAttributes, ReactNode } from 'react';
import { Connection } from './general';
import { HandleElement, HandleType } from './handles';
import { Node } from './nodes';
import { Position } from './utils';

// interface for the user edge items
type DefaultEdge<T = any> = {
  id: string;
  type?: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string | ReactNode;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  style?: CSSProperties;
  animated?: boolean;
  hidden?: boolean;
  deletable?: boolean;
  data?: T;
  className?: string;
  sourceNode?: Node;
  targetNode?: Node;
  selected?: boolean;
  markerStart?: EdgeMarkerType;
  markerEnd?: EdgeMarkerType;
  zIndex?: number;
  ariaLabel?: string;
  interactionWidth?: number;
};

export type SmoothStepPathOptions = {
  offset?: number;
  borderRadius?: number;
};

type SmoothStepEdgeType<T> = DefaultEdge<T> & {
  type: 'smoothstep';
  pathOptions?: SmoothStepPathOptions;
};

export type BezierPathOptions = {
  curvature?: number;
};

type BezierEdgeType<T> = DefaultEdge<T> & {
  type: 'default';
  pathOptions?: BezierPathOptions;
};

export type Edge<T = any> = DefaultEdge<T> | SmoothStepEdgeType<T> | BezierEdgeType<T>;

export type DefaultEdgeOptions = Omit<
  Edge,
  'id' | 'source' | 'target' | 'sourceHandle' | 'targetHandle' | 'sourceNode' | 'targetNode'
>;

// props that get passed to a custom edge
export type EdgeProps<T = any> = {
  id: string;
  source: string;
  target: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  selected?: boolean;
  animated?: boolean;
  sourcePosition: Position;
  targetPosition: Position;
  label?: string | ReactNode;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  style?: CSSProperties;
  data?: T;
  sourceHandleId?: string | null;
  targetHandleId?: string | null;
  markerStart?: string;
  markerEnd?: string;
  // @TODO: how can we get better types for pathOptions?
  pathOptions?: any;
  interactionWidth?: number;
};

export type BaseEdgeProps = Pick<
  EdgeProps,
  | 'label'
  | 'labelStyle'
  | 'labelShowBg'
  | 'labelBgStyle'
  | 'labelBgPadding'
  | 'labelBgBorderRadius'
  | 'style'
  | 'markerStart'
  | 'markerEnd'
  | 'interactionWidth'
> & {
  centerX: number;
  centerY: number;
  path: string;
};

export type EdgeMouseHandler = (event: React.MouseEvent, edge: Edge) => void;

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
  onEdgeUpdateStart?: (event: React.MouseEvent, edge: Edge, handleType: HandleType) => void;
  onEdgeUpdateEnd?: (event: MouseEvent, edge: Edge, handleType: HandleType) => void;
  rfId?: string;
  disableKeyboardA11y: boolean;
  pathOptions?: BezierPathOptions | SmoothStepPathOptions;
};

export interface SmoothStepEdgeProps<T = any> extends EdgeProps<T> {
  pathOptions?: SmoothStepPathOptions;
}

export interface BezierEdgeProps<T = any> extends EdgeProps<T> {
  pathOptions?: BezierPathOptions;
}
export interface EdgeTextProps extends HTMLAttributes<SVGElement> {
  x: number;
  y: number;
  label?: string | ReactNode;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
}

export enum ConnectionLineType {
  Bezier = 'default',
  Straight = 'straight',
  Step = 'step',
  SmoothStep = 'smoothstep',
  SimpleBezier = 'simplebezier',
}

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
};

export type ConnectionLineComponent = ComponentType<ConnectionLineComponentProps>;

export type OnEdgeUpdateFunc<T = any> = (oldEdge: Edge<T>, newConnection: Connection) => void;

export interface EdgeMarker {
  type: MarkerType;
  color?: string;
  width?: number;
  height?: number;
  markerUnits?: string;
  orient?: string;
  strokeWidth?: number;
}

export type EdgeMarkerType = string | EdgeMarker;

export enum MarkerType {
  Arrow = 'arrow',
  ArrowClosed = 'arrowclosed',
}

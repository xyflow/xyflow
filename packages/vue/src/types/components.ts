import type { Component, CSSProperties, DefineComponent, VNode } from 'vue';
import type { BezierEdge, SimpleBezierEdge, SmoothStepEdge, StepEdge, StraightEdge } from '../components';
import type { Edge, EdgeProps } from './edge';
import type { BuiltInNode, Node, NodeProps } from './node';

/** Global component names are components registered to the vue instance and are "autoloaded" by their string name */
type GlobalComponentName = string;

/** Node Components can either be a component definition or a string name */
export type NodeComponent<NodeType extends Node = Node>
  = | Component<NodeProps<NodeType>>
    | DefineComponent<NodeProps<NodeType>, any, any, any, any>
    | GlobalComponentName;

export type NodeTypesObject<NodeType extends Node = Node> = {
  [key in keyof DefaultNodeTypes]?: NodeComponent<BuiltInNode>
} & Record<string, NodeComponent<NodeType>>;

export type EdgeTypesObject<EdgeType extends Edge = Edge> = { [key in keyof DefaultEdgeTypes]?: EdgeComponent } & Record<
  string,
  EdgeComponent<EdgeType>
>;

/** Edge Components can either be a component definition or a string name */
export type EdgeComponent<EdgeType extends Edge = Edge>
  = | Component<EdgeProps<EdgeType>>
    | DefineComponent<EdgeProps<EdgeType>, any, any, any, any, any>
    | GlobalComponentName;

export interface DefaultEdgeTypes {
  default: typeof BezierEdge;
  straight: typeof StraightEdge;
  simplebezier: typeof SimpleBezierEdge;
  step: typeof StepEdge;
  smoothstep: typeof SmoothStepEdge;
}

export type DefaultNodeTypes = { [key in 'input' | 'output' | 'default']: NodeComponent<BuiltInNode> };

/** these props are passed to edge texts */
export interface EdgeTextProps {
  x: number;
  y: number;
  label?: string | VNode | object;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
}

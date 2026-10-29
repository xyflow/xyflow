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

export type DefaultNodeTypes = { [key in 'input' | 'output' | 'default' | 'group']: NodeComponent<BuiltInNode> };

/** these props are passed to edge texts */
export interface EdgeTextProps {
  /** The x position where the label should be rendered. */
  x: number;
  /** The y position where the label should be rendered. */
  y: number;
  /**
   * The label or custom element to render along the edge. This is commonly a text label or some
   * custom controls.
   */
  label?: string | VNode | Component;
  /** Custom styles to apply to the label. */
  labelStyle?: CSSProperties;
  /**
   * Render a background rectangle behind the label.
   *
   * @default true
   */
  labelShowBg?: boolean;
  /** Inline style applied to the label background rectangle. */
  labelBgStyle?: CSSProperties;
  /**
   * Padding around the label inside its background, as `[x, y]` in pixels.
   *
   * @default [2, 4]
   */
  labelBgPadding?: [number, number];
  /**
   * Border radius of the label background, in pixels.
   *
   * @default 2
   */
  labelBgBorderRadius?: number;
}

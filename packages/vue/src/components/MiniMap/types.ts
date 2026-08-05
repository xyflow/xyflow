import type { Dimensions, PanelPosition, XYPosition } from '@xyflow/system';
import type { CSSProperties, InjectionKey } from 'vue';
import type { InternalNode, NodeMouseEvent } from '../../types';

/** expects a node and returns a color value */
export type MiniMapNodeFunc = (node: InternalNode) => string;

export type ShapeRendering = CSSProperties['shapeRendering'];

export interface MiniMapProps {
  /** Fill color of each mini map node — a CSS color string, or a function that returns one per node. */
  nodeColor?: string | MiniMapNodeFunc;
  /** Stroke (border) color of each mini map node — a CSS color string, or a function that returns one per node. */
  nodeStrokeColor?: string | MiniMapNodeFunc;
  /** Extra class name for each mini map node — a string, or a function that returns one per node. */
  nodeClassName?: string | MiniMapNodeFunc;
  /**
   * Border radius of each mini map node, in pixels.
   *
   * @default 5
   */
  nodeBorderRadius?: number;
  /**
   * Stroke (border) width of each mini map node, in pixels.
   *
   * @default 2
   */
  nodeStrokeWidth?: number;
  /** Fill color of the mask that covers the area outside the current viewport. */
  maskColor?: string;
  /** Stroke color of the viewport mask. */
  maskStrokeColor?: string;
  /**
   * Stroke width of the viewport mask, in pixels.
   *
   * @default 1
   */
  maskStrokeWidth?: number;
  /**
   * Where to place the mini map within the flow, see {@link PanelPosition}.
   *
   * @default 'bottom-right'
   */
  position?: PanelPosition;
  /**
   * Allow panning the viewport by dragging on the mini map.
   *
   * @default false
   */
  pannable?: boolean;
  /**
   * Allow zooming the viewport by scrolling over the mini map.
   *
   * @default false
   */
  zoomable?: boolean;
  /**
   * Width of the mini map, in pixels.
   *
   * @default 200
   */
  width?: number;
  /**
   * Height of the mini map, in pixels.
   *
   * @default 150
   */
  height?: number;
  /**
   * Accessible label for the mini map. Pass `null` to render no label. Defaults to the flow's configured
   * mini map aria-label.
   */
  ariaLabel?: string | null;
  /**
   * Invert the pan direction, i.e. drag the mini map to move the viewport the opposite way.
   *
   * @default false
   */
  inversePan?: boolean;
  /**
   * How much each scroll step zooms when `zoomable` is enabled.
   *
   * @default 1
   */
  zoomStep?: number;
  /**
   * Padding around the flow's bounds within the mini map, as a multiple of the mini map's scale.
   *
   * @default 5
   */
  offsetScale?: number;
  /**
   * Border radius of the viewport mask, in pixels.
   *
   * @default 0
   */
  maskBorderRadius?: number;
}

/** these props are passed to mini map node slots */
export interface MiniMapNodeProps {
  /** The node's id. */
  id: string;
  /** The node's type. */
  type?: string;
  /** Whether the node is selected. */
  selected?: boolean;
  /** Whether the node is currently being dragged. */
  dragging?: boolean;
  /** The node's absolute position in the flow. */
  position: XYPosition;
  /** The node's measured width and height. */
  dimensions: Dimensions;
  /** Border radius for the rendered node, in pixels. */
  borderRadius?: number;
  /** Fill color for the rendered node. */
  color?: string;
  /** The SVG `shape-rendering` used to draw the node. */
  shapeRendering?: ShapeRendering;
  /** Stroke (border) color for the rendered node. */
  strokeColor?: string;
  /** Stroke (border) width for the rendered node. */
  strokeWidth?: number;
  /** Whether the node is hidden (hidden nodes aren't drawn on the mini map). */
  hidden?: boolean;
}

export interface MiniMapEmits {
  click: [params: { event: MouseEvent; position: XYPosition }];
  nodeClick: [params: NodeMouseEvent];
  nodeDblclick: [params: NodeMouseEvent];
  nodeMouseenter: [params: NodeMouseEvent];
  nodeMousemove: [params: NodeMouseEvent];
  nodeMouseleave: [params: NodeMouseEvent];
}

export interface MiniMapNodeEmits {
  click: [params: MouseEvent];
  dblclick: [params: MouseEvent];
  mouseenter: [params: MouseEvent];
  mousemove: [params: MouseEvent];
  mouseleave: [params: MouseEvent];
}

export interface MiniMapSlots extends Record<`node-${string}`, (nodeProps: MiniMapNodeProps) => any> {}

export const Slots: InjectionKey<MiniMapSlots> = Symbol('MiniMapSlots');

import type { Dimensions, PanelPosition, XYPosition } from '@xyflow/system';
import type { CSSProperties, InjectionKey } from 'vue';
import type { InternalNode, NodeMouseEvent } from '../../types';

/** expects a node and returns a color value */
export type MiniMapNodeFunc = (node: InternalNode) => string;

export type ShapeRendering = CSSProperties['shapeRendering'];

export interface MiniMapProps {
  /** Color of nodes on minimap. */
  nodeColor?: string | MiniMapNodeFunc;
  /** Stroke color of nodes on minimap. */
  nodeStrokeColor?: string | MiniMapNodeFunc;
  /** Class name applied to nodes on minimap. */
  nodeClassName?: string | MiniMapNodeFunc;
  /**
   * Border radius of nodes on minimap.
   *
   * @default 5
   */
  nodeBorderRadius?: number;
  /**
   * Stroke width of nodes on minimap.
   *
   * @default 2
   */
  nodeStrokeWidth?: number;
  /**
   * The color of the mask that covers the portion of the minimap not currently visible in the
   * viewport.
   */
  maskColor?: string;
  /** Stroke color of mask representing viewport. */
  maskStrokeColor?: string;
  /**
   * Stroke width of mask representing viewport.
   *
   * @default 1
   */
  maskStrokeWidth?: number;
  /**
   * Position of minimap on pane, see {@link PanelPosition}.
   *
   * @default 'bottom-right'
   */
  position?: PanelPosition;
  /**
   * Determines whether you can pan the viewport by dragging inside the minimap.
   *
   * @default false
   */
  pannable?: boolean;
  /**
   * Determines whether you can zoom the viewport by scrolling inside the minimap.
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
  /** Invert direction when panning the minimap viewport. */
  inversePan?: boolean;
  /**
   * Step size for zooming in/out on minimap.
   *
   * @default 1
   */
  zoomStep?: number;
  /**
   * Offset the viewport on the minimap, acts like a padding.
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

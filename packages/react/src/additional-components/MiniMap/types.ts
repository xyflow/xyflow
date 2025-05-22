/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, CSSProperties, HTMLAttributes, MouseEvent } from 'react';
import type { PanelPosition, XYPosition } from '@xyflow/system';

import type { Node } from '../../types';

export type GetMiniMapNodeAttribute<NodeType extends Node = Node> = (node: NodeType) => string;

/**
 * @expand
 */
export type MiniMapProps<NodeType extends Node = Node> = Omit<HTMLAttributes<SVGSVGElement>, 'onClick'> & {
  /**
   * Color of nodes on minimap.
   * @default "#e2e2e2"
   */
  nodeColor?: string | GetMiniMapNodeAttribute<NodeType>;
  /**
   * Stroke color of nodes on minimap.
   * @default "transparent"
   */
  nodeStrokeColor?: string | GetMiniMapNodeAttribute<NodeType>;
  /**
   * Class name applied to nodes on minimap.
   * @default ""
   */
  nodeClassName?: string | GetMiniMapNodeAttribute<NodeType>;
  /**
   * Border radius of nodes on minimap.
   * @default 5
   */
  nodeBorderRadius?: number;
  /**
   * Stroke width of nodes on minimap.
   * @default 2
   */
  nodeStrokeWidth?: number;
  /**
   * A custom component to render the nodes in the minimap. This component must render an SVG
   * element!
   */
  nodeComponent?: ComponentType<MiniMapNodeProps>;
  /** Background color of minimap. */
  bgColor?: string;
  /**
   * The color of the mask that covers the portion of the minimap not currently visible in the
   * viewport.
   * @default "rgba(240, 240, 240, 0.6)"
   */
  maskColor?: string;
  /**
   * Stroke color of mask representing viewport.
   * @default transparent
   */
  maskStrokeColor?: string;
  /**
   * Stroke width of mask representing viewport.
   * @default 1
   */
  maskStrokeWidth?: number;
  /**
   * Position of minimap on pane.
   * @default PanelPosition.BottomRight
   * @example PanelPosition.TopLeft, PanelPosition.TopRight,
   * PanelPosition.BottomLeft, PanelPosition.BottomRight
   */
  position?: PanelPosition;
  /** Callback called when minimap is clicked. */
  onClick?: (event: MouseEvent, position: XYPosition) => void;
  /** Callback called when node on minimap is clicked. */
  onNodeClick?: (event: MouseEvent, node: NodeType) => void;
  /**
   * Determines whether you can pan the viewport by dragging inside the minimap.
   * @default false
   */
  pannable?: boolean;
  /**
   * Determines whether you can zoom the viewport by scrolling inside the minimap.
   * @default false
   */
  zoomable?: boolean;
  /**
   * There is no text inside the minimap for a screen reader to use as an accessible name, so it's
   * important we provide one to make the minimap accessible. The default is sufficient, but you may
   * want to replace it with something more relevant to your app or product.
   * @default "Mini Map"
   */
  ariaLabel?: string | null;
  /** Invert direction when panning the minimap viewport. */
  inversePan?: boolean;
  /**
   * Step size for zooming in/out on minimap.
   * @default 10
   */
  zoomStep?: number;
  /**
   * Offset the viewport on the minimap, acts like a padding.
   * @default 5
   */
  offsetScale?: number;
};

export type MiniMapNodes<NodeType extends Node = Node> = Pick<
  MiniMapProps<NodeType>,
  'nodeColor' | 'nodeStrokeColor' | 'nodeClassName' | 'nodeBorderRadius' | 'nodeStrokeWidth' | 'nodeComponent'
> & {
  onClick?: (event: MouseEvent, nodeId: string) => void;
};

/**
 * The props that are passed to the MiniMapNode component
 *
 * @public
 * @expand
 */
export type MiniMapNodeProps = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
  className: string;
  color?: string;
  shapeRendering: string;
  strokeColor?: string;
  strokeWidth?: number;
  style?: CSSProperties;
  selected: boolean;
  onClick?: (event: MouseEvent, id: string) => void;
};

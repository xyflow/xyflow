/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, CSSProperties, HTMLAttributes, MouseEvent } from 'react';
import type { PanelPosition, XYPosition } from '@xyflow/system';

import type { Node } from '../../types';

export type GetMiniMapNodeAttribute<NodeType extends Node = Node> = (node: NodeType) => string;

export type MiniMapProps<NodeType extends Node = Node> = Omit<HTMLAttributes<SVGSVGElement>, 'onClick'> & {
  /** Color of nodes on minimap */
  nodeColor?: string | GetMiniMapNodeAttribute<NodeType>;
  /** Stroke color of nodes on minimap */
  nodeStrokeColor?: string | GetMiniMapNodeAttribute<NodeType>;
  /** ClassName applied to nodes on minimap */
  nodeClassName?: string | GetMiniMapNodeAttribute<NodeType>;
  /** Border radius of nodes on minimap */
  nodeBorderRadius?: number;
  /** Stroke width of nodes on minimap */
  nodeStrokeWidth?: number;
  /** Component used to render nodes on minimap */
  nodeComponent?: ComponentType<MiniMapNodeProps>;
  /** Background color of minimap */
  bgColor?: string;
  /** Color of mask representing viewport */
  maskColor?: string;
  /** Stroke color of mask representing viewport */
  maskStrokeColor?: string;
  /** Stroke width of mask representing viewport */
  maskStrokeWidth?: number;
  /** Position of minimap on pane
   * @example PanelPosition.TopLeft, PanelPosition.TopRight,
   * PanelPosition.BottomLeft, PanelPosition.BottomRight
   */
  position?: PanelPosition;
  /** Callback caled when minimap is clicked*/
  onClick?: (event: MouseEvent, position: XYPosition) => void;
  /** Callback called when node on minimap is clicked */
  onNodeClick?: (event: MouseEvent, node: NodeType) => void;
  /** If true, viewport is pannable via mini map component */
  pannable?: boolean;
  /** If true, viewport is zoomable via mini map component */
  zoomable?: boolean;
  /** The aria-label attribute */
  ariaLabel?: string | null;
  /** Invert direction when panning the minimap viewport */
  inversePan?: boolean;
  /** Step size for zooming in/out on minimap */
  zoomStep?: number;
  /** Offset the viewport on the minmap, acts like a padding */
  offsetScale?: number;
};

export type MiniMapNodes<NodeType extends Node = Node> = Pick<
  MiniMapProps<NodeType>,
  'nodeColor' | 'nodeStrokeColor' | 'nodeClassName' | 'nodeBorderRadius' | 'nodeStrokeWidth' | 'nodeComponent'
> & {
  onClick?: (event: MouseEvent, nodeId: string) => void;
};

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

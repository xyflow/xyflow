/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, CSSProperties, HTMLAttributes, MouseEvent } from 'react';
import type { PanelPosition, XYPosition } from '@xyflow/system';

import type { Node } from '../../types';

export type GetMiniMapNodeAttribute<NodeType extends Node = Node> = (node: NodeType) => string;

export type MiniMapProps<NodeType extends Node = Node> = Omit<HTMLAttributes<SVGSVGElement>, 'onClick'> & {
  /** color of nodes on minimap */
  nodeColor?: string | GetMiniMapNodeAttribute<NodeType>;
  /** stroke color of nodes on minimap */
  nodeStrokeColor?: string | GetMiniMapNodeAttribute<NodeType>;
  /** className applied to nodes on minimap */
  nodeClassName?: string | GetMiniMapNodeAttribute<NodeType>;
  /** boder radius of nodes on minimap */
  nodeBorderRadius?: number;
  /** stroke width of nodes on minimap */
  nodeStrokeWidth?: number;
  /** component used to render nodes on minimap */
  nodeComponent?: ComponentType<MiniMapNodeProps>;
  /** color of mask representing viewport */
  maskColor?: string;
  /** stroke color of mask representing viewport */
  maskStrokeColor?: string;
  /** stroke width of mask representing viewport */
  maskStrokeWidth?: number;
  /** position of minimap on pane
   * @example PanelPosition.TopLeft, PanelPosition.TopRight,
   * PanelPosition.BottomLeft, PanelPosition.BottomRight
   */
  position?: PanelPosition;
  /** callback caled when minimap is clicked*/
  onClick?: (event: MouseEvent, position: XYPosition) => void;
  /** callback called when node on minimap is clicked */
  onNodeClick?: (event: MouseEvent, node: NodeType) => void;
  pannable?: boolean;
  zoomable?: boolean;
  ariaLabel?: string | null;
  /** invert direction when panning the minimap viewport */
  inversePan?: boolean;
  /** step size for zooming in/out on minimap */
  zoomStep?: number;
  /** offset the viewport on the minmap, acts like a padding */
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

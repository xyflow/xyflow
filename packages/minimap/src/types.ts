/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, CSSProperties, HTMLAttributes, MouseEvent } from 'react';
import type { Node, PanelPosition, XYPosition } from '@reactflow/core';

export type GetMiniMapNodeAttribute<NodeData = any> = (node: Node<NodeData>) => string;

export type MiniMapProps<NodeData = any> = Omit<HTMLAttributes<SVGSVGElement>, 'onClick'> & {
  nodeColor?: string | GetMiniMapNodeAttribute<NodeData>;
  nodeStrokeColor?: string | GetMiniMapNodeAttribute<NodeData>;
  nodeClassName?: string | GetMiniMapNodeAttribute<NodeData>;
  nodeBorderRadius?: number;
  nodeStrokeWidth?: number;
  nodeComponent?: ComponentType<MiniMapNodeProps>;
  maskColor?: string;
  maskStrokeColor?: string;
  maskStrokeWidth?: number;
  position?: PanelPosition;
  onClick?: (event: MouseEvent, position: XYPosition) => void;
  onNodeClick?: (event: MouseEvent, node: Node<NodeData>) => void;
  pannable?: boolean;
  zoomable?: boolean;
  ariaLabel?: string | null;
  inversePan?: boolean;
  zoomStep?: number;
};

export interface MiniMapNodeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
  className: string;
  color: string;
  shapeRendering: string;
  strokeColor: string;
  strokeWidth: number;
  style?: CSSProperties;
  onClick?: (event: MouseEvent, id: string) => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, CSSProperties, HTMLAttributes, MouseEvent } from 'react';
import type { PanelPosition, XYPosition } from '@xyflow/system';

import type { Node } from '../../types';

export type GetMiniMapNodeAttribute<NodeType extends Node = Node> = (node: NodeType) => string;

export type MiniMapProps<NodeType extends Node = Node> = Omit<HTMLAttributes<SVGSVGElement>, 'onClick'> & {
  nodeColor?: string | GetMiniMapNodeAttribute<NodeType>;
  nodeStrokeColor?: string | GetMiniMapNodeAttribute<NodeType>;
  nodeClassName?: string | GetMiniMapNodeAttribute<NodeType>;
  nodeBorderRadius?: number;
  nodeStrokeWidth?: number;
  nodeComponent?: ComponentType<MiniMapNodeProps>;
  maskColor?: string;
  maskStrokeColor?: string;
  maskStrokeWidth?: number;
  position?: PanelPosition;
  onClick?: (event: MouseEvent, position: XYPosition) => void;
  onNodeClick?: (event: MouseEvent, node: NodeType) => void;
  pannable?: boolean;
  zoomable?: boolean;
  ariaLabel?: string | null;
  inversePan?: boolean;
  zoomStep?: number;
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

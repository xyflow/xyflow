/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLAttributes, MouseEvent } from 'react';
import { Node, PanelPosition, XYPosition } from '@reactflow/core';

export type GetMiniMapNodeAttribute<NodeData = any> = (node: Node<NodeData>) => string;

export type MiniMapProps<NodeData = any> = Omit<HTMLAttributes<SVGSVGElement>, 'onClick'> & {
  nodeColor?: string | GetMiniMapNodeAttribute<NodeData>;
  nodeStrokeColor?: string | GetMiniMapNodeAttribute<NodeData>;
  nodeClassName?: string | GetMiniMapNodeAttribute<NodeData>;
  nodeBorderRadius?: number;
  nodeStrokeWidth?: number;
  maskColor?: string;
  position?: PanelPosition;
  onClick?: (event: MouseEvent, position: XYPosition) => void;
};

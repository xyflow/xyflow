/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLAttributes } from 'react';
import { Node, PanelPosition } from '@reactflow/core';

export type GetMiniMapNodeAttribute<NodeData = any> = (node: Node<NodeData>) => string;

export interface MiniMapProps<NodeData = any> extends HTMLAttributes<SVGSVGElement> {
  nodeColor?: string | GetMiniMapNodeAttribute<NodeData>;
  nodeStrokeColor?: string | GetMiniMapNodeAttribute<NodeData>;
  nodeClassName?: string | GetMiniMapNodeAttribute<NodeData>;
  nodeBorderRadius?: number;
  nodeStrokeWidth?: number;
  maskColor?: string;
  position?: PanelPosition;
}

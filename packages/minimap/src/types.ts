/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HTMLAttributes } from 'react';
import type { Node, PanelPosition } from '@reactflow/core';

export type GetMiniMapNodeAttribute<NodeData = any> = (node: Node<NodeData>) => string;

export type MiniMapProps<NodeData = any> = HTMLAttributes<SVGSVGElement> & {
  nodeColor?: string | GetMiniMapNodeAttribute<NodeData>;
  nodeStrokeColor?: string | GetMiniMapNodeAttribute<NodeData>;
  nodeClassName?: string | GetMiniMapNodeAttribute<NodeData>;
  nodeBorderRadius?: number;
  nodeStrokeWidth?: number;
  maskColor?: string;
  position?: PanelPosition;
};

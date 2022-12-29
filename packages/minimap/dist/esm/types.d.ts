import type { HTMLAttributes, MouseEvent } from 'react';
import type { Node, PanelPosition, XYPosition } from '@reactflow/core';
export declare type GetMiniMapNodeAttribute<NodeData = any> = (node: Node<NodeData>) => string;
export declare type MiniMapProps<NodeData = any> = Omit<HTMLAttributes<SVGSVGElement>, 'onClick'> & {
    nodeColor?: string | GetMiniMapNodeAttribute<NodeData>;
    nodeStrokeColor?: string | GetMiniMapNodeAttribute<NodeData>;
    nodeClassName?: string | GetMiniMapNodeAttribute<NodeData>;
    nodeBorderRadius?: number;
    nodeStrokeWidth?: number;
    maskColor?: string;
    maskStrokeColor?: string;
    maskStrokeWidth?: number;
    position?: PanelPosition;
    onClick?: (event: MouseEvent, position: XYPosition) => void;
    onNodeClick?: (event: MouseEvent, node: Node<NodeData>) => void;
    pannable?: boolean;
    zoomable?: boolean;
    ariaLabel?: string | null;
};
//# sourceMappingURL=types.d.ts.map
import React from 'react';
import { Node } from '../../types';
declare type StringFunc = (node: Node) => string;
interface MiniMapProps extends React.HTMLAttributes<HTMLCanvasElement> {
    bgColor?: string;
    nodeColor?: string | StringFunc;
}
declare const _default: ({ style, className, bgColor, nodeColor, }: MiniMapProps) => JSX.Element;
export default _default;

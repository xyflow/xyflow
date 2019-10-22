import React from 'react';
import { Node } from '../../types';
declare type StringFunc = (node: Node) => string;
interface MiniMapProps extends React.HTMLAttributes<SVGSVGElement> {
    nodeColor: string | StringFunc;
    nodeBorderRadius: number;
    maskColor: string;
}
declare const _default: ({ style, className, nodeColor, nodeBorderRadius, maskColor, }: MiniMapProps) => JSX.Element;
export default _default;

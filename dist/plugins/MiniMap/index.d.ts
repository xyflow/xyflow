import { CSSProperties } from 'react';
import { Node } from '../../types';
declare type StringFunc = (node: Node) => string;
interface MiniMapProps {
    style?: CSSProperties;
    className?: string | null;
    bgColor?: string;
    nodeColor?: string | StringFunc;
}
declare const _default: ({ style, className, bgColor, nodeColor }: MiniMapProps) => JSX.Element;
export default _default;

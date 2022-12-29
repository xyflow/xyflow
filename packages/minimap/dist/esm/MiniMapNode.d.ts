import type { CSSProperties, MouseEvent } from 'react';
interface MiniMapNodeProps {
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
declare const _default: import("react").MemoExoticComponent<{
    ({ id, x, y, width, height, style, color, strokeColor, strokeWidth, className, borderRadius, shapeRendering, onClick, }: MiniMapNodeProps): JSX.Element;
    displayName: string;
}>;
export default _default;
//# sourceMappingURL=MiniMapNode.d.ts.map
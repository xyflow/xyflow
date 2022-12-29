import type { CSSProperties, ReactNode } from 'react';
import type { D3DragEvent, SubjectPosition } from 'd3-drag';
export declare type ResizeEventParams = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare type NodeResizerProps = {
    nodeId?: string;
    color?: string;
    handleClassName?: string;
    handleStyle?: CSSProperties;
    lineClassName?: string;
    lineStyle?: CSSProperties;
    isVisible?: boolean;
    minWidth?: number;
    minHeight?: number;
    onResizeStart?: (event: ResizeDragEvent, params: ResizeEventParams) => void;
    onResize?: (event: ResizeDragEvent, params: ResizeEventParams) => void;
    onResizeEnd?: (event: ResizeDragEvent, params: ResizeEventParams) => void;
};
export declare type ControlLinePosition = 'top' | 'bottom' | 'left' | 'right';
export declare type ControlPosition = ControlLinePosition | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export declare enum ResizeControlVariant {
    Line = "line",
    Handle = "handle"
}
export declare type ResizeControlProps = Pick<NodeResizerProps, 'nodeId' | 'color' | 'minWidth' | 'minHeight' | 'onResizeStart' | 'onResize' | 'onResizeEnd'> & {
    position?: ControlPosition;
    variant?: ResizeControlVariant;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
};
export declare type ResizeControlLineProps = ResizeControlProps & {
    position?: ControlLinePosition;
};
export declare type ResizeDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
//# sourceMappingURL=types.d.ts.map
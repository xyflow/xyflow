import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import type { FitViewOptions, PanelPosition } from '@reactflow/core';
export declare type ControlProps = HTMLAttributes<HTMLDivElement> & {
    showZoom?: boolean;
    showFitView?: boolean;
    showInteractive?: boolean;
    fitViewOptions?: FitViewOptions;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onFitView?: () => void;
    onInteractiveChange?: (interactiveStatus: boolean) => void;
    position?: PanelPosition;
};
export declare type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
//# sourceMappingURL=types.d.ts.map
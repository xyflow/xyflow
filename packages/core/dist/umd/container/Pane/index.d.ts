/**
 * The user selection rectangle gets displayed when a user drags the mouse while pressing shift
 */
import { ReactNode } from 'react';
import type { ReactFlowProps } from '../../types';
declare type PaneProps = {
    isSelecting: boolean;
    children: ReactNode;
} & Partial<Pick<ReactFlowProps, 'selectionMode' | 'panOnDrag' | 'onSelectionStart' | 'onSelectionEnd' | 'onPaneClick' | 'onPaneContextMenu' | 'onPaneScroll' | 'onPaneMouseEnter' | 'onPaneMouseMove' | 'onPaneMouseLeave'>>;
declare const Pane: import("react").MemoExoticComponent<({ isSelecting, selectionMode, panOnDrag, onSelectionStart, onSelectionEnd, onPaneClick, onPaneContextMenu, onPaneScroll, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, children, }: PaneProps) => JSX.Element>;
export default Pane;
//# sourceMappingURL=index.d.ts.map
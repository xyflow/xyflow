import type { ReactNode } from 'react';
import { GraphViewProps } from '../GraphView';
export declare type FlowRendererProps = Omit<GraphViewProps, 'snapToGrid' | 'nodeTypes' | 'edgeTypes' | 'snapGrid' | 'connectionLineType' | 'connectionLineContainerStyle' | 'arrowHeadColor' | 'onlyRenderVisibleElements' | 'selectNodesOnDrag' | 'defaultMarkerColor' | 'rfId' | 'nodeOrigin'> & {
    children: ReactNode;
};
declare const _default: import("react").MemoExoticComponent<{
    ({ children, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, deleteKeyCode, onMove, onMoveStart, onMoveEnd, selectionKeyCode, selectionOnDrag, selectionMode, onSelectionStart, onSelectionEnd, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, elementsSelectable, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, onSelectionContextMenu, noWheelClassName, noPanClassName, disableKeyboardA11y, }: FlowRendererProps): JSX.Element;
    displayName: string;
}>;
export default _default;
//# sourceMappingURL=index.d.ts.map
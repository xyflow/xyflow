/// <reference types="react" />
import type { FlowRendererProps } from '../FlowRenderer';
declare type ZoomPaneProps = Omit<FlowRendererProps, 'deleteKeyCode' | 'selectionKeyCode' | 'multiSelectionKeyCode' | 'noDragClassName' | 'disableKeyboardA11y' | 'selectionOnDrag'>;
declare const ZoomPane: ({ onMove, onMoveStart, onMoveEnd, onPaneContextMenu, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, elementsSelectable, panOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, zoomActivationKeyCode, preventScrolling, children, noWheelClassName, noPanClassName, }: ZoomPaneProps) => JSX.Element;
export default ZoomPane;
//# sourceMappingURL=index.d.ts.map
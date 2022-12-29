/// <reference types="react" />
import type { EdgeTypesWrapped, NodeTypesWrapped, ReactFlowProps } from '../../types';
export declare type GraphViewProps = Omit<ReactFlowProps, 'onSelectionChange' | 'nodes' | 'edges' | 'nodeTypes' | 'edgeTypes'> & Required<Pick<ReactFlowProps, 'selectionKeyCode' | 'deleteKeyCode' | 'multiSelectionKeyCode' | 'connectionLineType' | 'onlyRenderVisibleElements' | 'translateExtent' | 'minZoom' | 'maxZoom' | 'defaultMarkerColor' | 'selectNodesOnDrag' | 'noDragClassName' | 'noDragClassName' | 'noWheelClassName' | 'noPanClassName' | 'defaultViewport' | 'disableKeyboardA11y' | 'nodeOrigin'>> & {
    nodeTypes: NodeTypesWrapped;
    edgeTypes: EdgeTypesWrapped;
    rfId: string;
};
declare const _default: import("react").MemoExoticComponent<{
    ({ nodeTypes, edgeTypes, onMove, onMoveStart, onMoveEnd, onInit, onNodeClick, onEdgeClick, onNodeDoubleClick, onEdgeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, selectionOnDrag, selectionMode, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, deleteKeyCode, onlyRenderVisibleElements, elementsSelectable, selectNodesOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, defaultMarkerColor, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, onEdgeUpdate, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, edgeUpdaterRadius, onEdgeUpdateStart, onEdgeUpdateEnd, noDragClassName, noWheelClassName, noPanClassName, elevateEdgesOnSelect, disableKeyboardA11y, nodeOrigin, nodeExtent, rfId, }: GraphViewProps): JSX.Element;
    displayName: string;
}>;
export default _default;
//# sourceMappingURL=index.d.ts.map
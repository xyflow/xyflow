/// <reference types="react" />
import { GraphViewProps } from '../GraphView';
declare type EdgeRendererProps = Pick<GraphViewProps, 'edgeTypes' | 'connectionLineType' | 'connectionLineType' | 'connectionLineStyle' | 'connectionLineComponent' | 'connectionLineContainerStyle' | 'connectionLineContainerStyle' | 'onEdgeClick' | 'onEdgeDoubleClick' | 'defaultMarkerColor' | 'onlyRenderVisibleElements' | 'onEdgeUpdate' | 'onEdgeContextMenu' | 'onEdgeMouseEnter' | 'onEdgeMouseMove' | 'onEdgeMouseLeave' | 'onEdgeUpdateStart' | 'onEdgeUpdateEnd' | 'edgeUpdaterRadius' | 'noPanClassName' | 'elevateEdgesOnSelect' | 'rfId' | 'disableKeyboardA11y'> & {
    elevateEdgesOnSelect: boolean;
};
declare const _default: import("react").MemoExoticComponent<{
    (props: EdgeRendererProps): JSX.Element | null;
    displayName: string;
}>;
export default _default;
//# sourceMappingURL=index.d.ts.map
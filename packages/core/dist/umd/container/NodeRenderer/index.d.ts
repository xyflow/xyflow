/// <reference types="react" />
import { GraphViewProps } from '../GraphView';
declare type NodeRendererProps = Pick<GraphViewProps, 'nodeTypes' | 'selectNodesOnDrag' | 'onNodeClick' | 'onNodeDoubleClick' | 'onNodeMouseEnter' | 'onNodeMouseMove' | 'onNodeMouseLeave' | 'onNodeContextMenu' | 'onlyRenderVisibleElements' | 'noPanClassName' | 'noDragClassName' | 'rfId' | 'disableKeyboardA11y' | 'nodeOrigin' | 'nodeExtent'>;
declare const _default: import("react").MemoExoticComponent<{
    (props: NodeRendererProps): JSX.Element;
    displayName: string;
}>;
export default _default;
//# sourceMappingURL=index.d.ts.map
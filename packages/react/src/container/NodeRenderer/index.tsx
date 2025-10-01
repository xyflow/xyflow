import { memo } from 'react';
import { shallow } from 'zustand/shallow';

import { useVisibleNodeIds } from '../../hooks/useVisibleNodeIds';
import { useStore } from '../../hooks/useStore';
import { containerStyle } from '../../styles/utils';
import { GraphViewProps } from '../GraphView';
import { useResizeObserver } from './useResizeObserver';
import NodeWrapper from '../../components/NodeWrapper';
import type { Node, ReactFlowState } from '../../types';

export type NodeRendererProps<NodeType extends Node> = Pick<
  GraphViewProps<NodeType>,
  | 'onNodeClick'
  | 'onNodeDoubleClick'
  | 'onNodeMouseEnter'
  | 'onNodeMouseMove'
  | 'onNodeMouseLeave'
  | 'onNodeContextMenu'
  | 'onlyRenderVisibleElements'
  | 'noPanClassName'
  | 'noDragClassName'
  | 'rfId'
  | 'disableKeyboardA11y'
  | 'nodeExtent'
  | 'nodeTypes'
  | 'nodeClickDistance'
>;

const selector = (s: ReactFlowState) => ({
  nodesDraggable: s.nodesDraggable,
  nodesConnectable: s.nodesConnectable,
  nodesFocusable: s.nodesFocusable,
  elementsSelectable: s.elementsSelectable,
  onError: s.onError,
});

function NodeRendererComponent<NodeType extends Node>(props: NodeRendererProps<NodeType>) {
  const { nodesDraggable, nodesConnectable, nodesFocusable, elementsSelectable, onError } = useStore(selector, shallow);
  const nodeIds = useVisibleNodeIds(props.onlyRenderVisibleElements);
  const resizeObserver = useResizeObserver();

  return (
    <div className="react-flow__nodes" style={containerStyle}>
      {nodeIds.map((nodeId) => {
        return (
          /*
           * The split of responsibilities between NodeRenderer and
           * NodeComponentWrapper may appear weird. However, it’s designed to
           * minimize the cost of updates when individual nodes change.
           *
           * For example, when you’re dragging a single node, that node gets
           * updated multiple times per second. If `NodeRenderer` were to update
           * every time, it would have to re-run the `nodes.map()` loop every
           * time. This gets pricey with hundreds of nodes, especially if every
           * loop cycle does more than just rendering a JSX element!
           *
           * As a result of this choice, we took the following implementation
           * decisions:
           * - NodeRenderer subscribes *only* to node IDs – and therefore
           *   rerender *only* when visible nodes are added or removed.
           * - NodeRenderer performs all operations the result of which can be
           *   shared between nodes (such as creating the `ResizeObserver`
           *   instance, or subscribing to `selector`). This means extra prop
           *   drilling into `NodeComponentWrapper`, but it means we need to run
           *   these operations only once – instead of once per node.
           * - Any operations that you’d normally write inside `nodes.map` are
           *   moved into `NodeComponentWrapper`. This ensures they are
           *   memorized – so if `NodeRenderer` *has* to rerender, it only
           *   needs to regenerate the list of nodes, nothing else.
           */
          <NodeWrapper<NodeType>
            key={nodeId}
            id={nodeId}
            nodeTypes={props.nodeTypes}
            nodeExtent={props.nodeExtent}
            onClick={props.onNodeClick}
            onMouseEnter={props.onNodeMouseEnter}
            onMouseMove={props.onNodeMouseMove}
            onMouseLeave={props.onNodeMouseLeave}
            onContextMenu={props.onNodeContextMenu}
            onDoubleClick={props.onNodeDoubleClick}
            noDragClassName={props.noDragClassName}
            noPanClassName={props.noPanClassName}
            rfId={props.rfId}
            disableKeyboardA11y={props.disableKeyboardA11y}
            resizeObserver={resizeObserver}
            nodesDraggable={nodesDraggable}
            nodesConnectable={nodesConnectable}
            nodesFocusable={nodesFocusable}
            elementsSelectable={elementsSelectable}
            nodeClickDistance={props.nodeClickDistance}
            onError={onError}
          />
        );
      })}
    </div>
  );
}

NodeRendererComponent.displayName = 'NodeRenderer';

export const NodeRenderer = memo(NodeRendererComponent) as typeof NodeRendererComponent;

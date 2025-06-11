import { useVisibleNodeIds } from '../../hooks/useVisibleNodeIds';
import { useStore } from '../../hooks/useStore';
import { containerStyle } from '../../styles/utils';
import { GraphViewProps } from '../GraphView';
import { useResizeObserver } from './useResizeObserver';
import { NodeWrapper } from '../../components/NodeWrapper';
import type { Node, SolidFlowState } from '../../types';
import { For } from 'solid-js';

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

const selector = (s: SolidFlowState) => ({
  nodesDraggable: () => s.nodesDraggable.get(),
  nodesConnectable: () => s.nodesConnectable.get(),
  nodesFocusable: () => s.nodesFocusable.get(),
  elementsSelectable: () => s.elementsSelectable.get(),
  onError: () => s.onError.get(),
});

function NodeRendererComponent<NodeType extends Node>(props: NodeRendererProps<NodeType>) {
  const storeData = useStore(selector);
  const nodeIds = useVisibleNodeIds(() => props.onlyRenderVisibleElements);
  const resizeObserver = useResizeObserver();

  return (
    <div class="react-flow__nodes" style={containerStyle}>
      <For each={nodeIds()}>
        {(nodeId) => {
          return (
            /*
             * The split of responsibilities between NodeRenderer and
             * NodeComponentWrapper may appear weird. However, it's designed to
             * minimize the cost of updates when individual nodes change.
             *
             * For example, when you're dragging a single node, that node gets
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
             * - Any operations that you'd normally write inside `nodes.map` are
             *   moved into `NodeComponentWrapper`. This ensures they are
             *   memorized – so if `NodeRenderer` *has* to rerender, it only
             *   needs to regenerate the list of nodes, nothing else.
             */
            <NodeWrapper<NodeType>
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
              resizeObserver={resizeObserver()}
              nodesDraggable={storeData.nodesDraggable()}
              nodesConnectable={storeData.nodesConnectable()}
              nodesFocusable={storeData.nodesFocusable()}
              elementsSelectable={storeData.elementsSelectable()}
              nodeClickDistance={props.nodeClickDistance}
              onError={storeData.onError()}
            />
          );
        }}
      </For>
    </div>
  );
}

NodeRendererComponent.displayName = 'NodeRenderer';

export const NodeRenderer = NodeRendererComponent;

import cc from 'classcat';
import { NodeLookup } from '@xyflow/system';

import { Provider } from '../../contexts/NodeIdContext';
import { ReactFlowStaticProps } from '..';
import { InternalNode, Node } from '../../types';
import { builtinNodeTypes } from '../../components/NodeWrapper/utils';

export function NodeWrapper<NodeType extends Node = Node>({
  id,
  nodeLookup,
  nodeTypes,
}: {
  id: string;
  nodeLookup: NodeLookup<InternalNode<NodeType>>;
  nodeTypes: ReactFlowStaticProps['nodeTypes'];
}) {
  const node = nodeLookup.get(id);

  if (!node) {
    throw new Error(`Node with id "${id}" not found.`);
  }

  const nodeType = node.type || 'default';
  const NodeComponent = nodeTypes?.[nodeType] || builtinNodeTypes[nodeType];

  if (NodeComponent === undefined) {
    console.error(`Node type "${nodeType}" not found.`);
    return null;
  }

  const { internals } = node;

  return (
    <div
      className={cc(['react-flow__node', `react-flow__node-${nodeType}`, node.className])}
      style={{
        zIndex: internals.z,
        transform: `translate(${internals.positionAbsolute.x}px,${internals.positionAbsolute.y}px)`,
        ...node.style,
        width: node.width,
        height: node.height,
      }}
      data-id={node.id}
      data-testid={`rf__node-${node.id}`}
      role={node.ariaRole}
      aria-roledescription="node"
      aria-label={node.ariaLabel}
      {...node.domAttributes}
    >
      <Provider value={node.id}>
        <NodeComponent
          id={node.id}
          data={node.data}
          type={nodeType}
          positionAbsoluteX={internals.positionAbsolute.x}
          positionAbsoluteY={internals.positionAbsolute.y}
          selected={node.selected ?? false}
          selectable={false}
          draggable={false}
          deletable={false}
          isConnectable={false}
          sourcePosition={node.sourcePosition}
          targetPosition={node.targetPosition}
          dragging={false}
          dragHandle={node.dragHandle}
          zIndex={internals.z}
          parentId={node.parentId}
          width={node.width}
          height={node.height}
        />
      </Provider>
    </div>
  );
}

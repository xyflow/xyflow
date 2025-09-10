import { NodeLookup } from '@xyflow/system';

import { ReactFlowStaticProps } from '..';
import { NodeWrapper } from './NodeWrapper';
import { InternalNode, Node } from '../../types';

export function NodeRenderer<NodeType extends Node = Node>({
  nodeLookup,
  nodeTypes,
}: {
  nodeLookup: NodeLookup<InternalNode<NodeType>>;
  nodeTypes: ReactFlowStaticProps<NodeType>['nodeTypes'];
}) {
  return Array.from(nodeLookup).map(([id, node]) => <NodeWrapper key={id} node={node} nodeTypes={nodeTypes} />);
}

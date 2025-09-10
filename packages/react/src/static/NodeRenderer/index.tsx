import { NodeLookup } from '@xyflow/system';

import { ReactFlowStaticProps } from '..';
import { NodeWrapper } from './NodeWrapper';
import { InternalNode, Node } from '../../types';

export function NodeRenderer<NodeType extends Node = Node>({
  nodes,
  nodeLookup,
  nodeTypes,
}: {
  nodes: ReactFlowStaticProps<NodeType>['nodes'];
  nodeLookup: NodeLookup<InternalNode<NodeType>>;
  nodeTypes: ReactFlowStaticProps<NodeType>['nodeTypes'];
}) {
  return nodes?.map((node) => <NodeWrapper key={node.id} id={node.id} nodeTypes={nodeTypes} nodeLookup={nodeLookup} />);
}

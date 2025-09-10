import { NodeLookup } from '@xyflow/system';
import { ReactFlowStaticProps } from '..';
import { Edge, InternalNode, Node } from '../../types';
import { EdgeWrapper } from './EdgeWrapper';

export function EdgeRenderer<NodeType extends Node = Node, EdgeType extends Edge = Edge>({
  edges,
  nodeLookup,
  edgeTypes,
}: {
  nodeLookup: NodeLookup<InternalNode<NodeType>>;
  edgeTypes: ReactFlowStaticProps<NodeType>['edgeTypes'];
  edges: ReactFlowStaticProps<NodeType, EdgeType>['edges'];
}) {
  return (
    <div className="react-flow__edges">
      {edges?.map((edge) => (
        <EdgeWrapper<NodeType, EdgeType> key={edge.id} edge={edge} nodeLookup={nodeLookup} edgeTypes={edgeTypes} />
      ))}
    </div>
  );
}

import React, { memo, ComponentType } from 'react';

import { useStoreState } from '../../store/hooks';
import { isNode } from '../../utils/graph';
import { Node, Transform, NodeTypesType, NodeComponentProps, } from '../../types';

interface NodeRendererProps {
  nodeTypes: NodeTypesType;
  onElementClick: () => void;
  onNodeDragStop: () => void;
};

interface NodeRendererState {
  nodes: Node[];
  transform: Transform;
  selectedElements: any;
};

function renderNode(node: Node, props: NodeRendererProps, state: NodeRendererState) {
  const nodeType = node.type || 'default';

  if (!props.nodeTypes[nodeType]) {
    console.warn(`No node type found for type "${nodeType}". Using fallback type "default".`);
  }

  const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default) as ComponentType<NodeComponentProps>;
  const selected = state.selectedElements
    .filter(isNode)
    .map((e: Node) => e.id)
    .includes(node.id);

  return (
    <NodeComponent
      key={node.id}
      id={node.id}
      type={node.type}
      data={node.data}
      xPos={node.__rg.position.x}
      yPos={node.__rg.position.y}
      onClick={props.onElementClick}
      onNodeDragStop={props.onNodeDragStop}
      transform={state.transform}
      selected={selected}
      style={node.style}
    />
  );
}

const NodeRenderer = memo((props: NodeRendererProps) => {
  const state: NodeRendererState = useStoreState(s => ({
    nodes: s.nodes,
    transform: s.transform,
    selectedElements: s.selectedElements
  }));

  const { transform, nodes } = state;
  const transformStyle = { transform : `translate(${transform[0]}px,${transform[1]}px) scale(${transform[2]})` };

  return (
    <div
      className="react-flow__nodes"
      style={transformStyle}
    >
      {nodes.map(node => renderNode(node, props, state))}
    </div>
  );
});

NodeRenderer.displayName = 'NodeRenderer';

export default NodeRenderer;

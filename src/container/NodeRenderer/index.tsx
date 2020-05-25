import React, { memo, ComponentType } from 'react';

import { useStoreState } from '../../store/hooks';
import { getNodesInside } from '../../utils/graph';
import { Node, Transform, NodeTypesType, WrapNodeProps, Elements, Edge } from '../../types';

interface NodeRendererProps {
  nodeTypes: NodeTypesType;
  onElementClick: (element: Node | Edge) => void;
  onNodeDragStart: (node: Node) => void;
  onNodeDragStop: (node: Node) => void;
  onlyRenderVisibleNodes?: boolean;
}

function renderNode(
  node: Node,
  props: NodeRendererProps,
  transform: Transform,
  selectedElements: Elements,
  isInteractive: boolean
) {
  const nodeType = node.type || 'default';
  const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default) as ComponentType<WrapNodeProps>;
  if (!props.nodeTypes[nodeType]) {
    console.warn(`No node type found for type "${nodeType}". Using fallback type "default".`);
  }

  const isSelected = selectedElements.some(({ id }) => id === node.id);

  return (
    <NodeComponent
      key={node.id}
      id={node.id}
      type={nodeType}
      data={node.data}
      xPos={node.__rg.position.x}
      yPos={node.__rg.position.y}
      onClick={props.onElementClick}
      onNodeDragStart={props.onNodeDragStart}
      onNodeDragStop={props.onNodeDragStop}
      transform={transform}
      selected={isSelected}
      style={node.style}
      isInteractive={isInteractive}
      sourcePosition={node.sourcePosition}
      targetPosition={node.targetPosition}
    />
  );
}

const NodeRenderer = memo(({ onlyRenderVisibleNodes = true, ...props }: NodeRendererProps) => {
  const { nodes, transform, selectedElements, width, height, isInteractive } = useStoreState((s) => ({
    nodes: s.nodes,
    transform: s.transform,
    selectedElements: s.selectedElements,
    width: s.width,
    height: s.height,
    isInteractive: s.isInteractive,
  }));

  const [tx, ty, tScale] = transform;
  const transformStyle = {
    transform: `translate(${tx}px,${ty}px) scale(${tScale})`,
  };

  const renderNodes = onlyRenderVisibleNodes
    ? getNodesInside(nodes, { x: 0, y: 0, width, height }, transform, true)
    : nodes;

  return (
    <div className="react-flow__nodes" style={transformStyle}>
      {renderNodes.map((node) => renderNode(node, props, transform, selectedElements, isInteractive))}
    </div>
  );
});

NodeRenderer.displayName = 'NodeRenderer';

export default NodeRenderer;

import React, { memo, ComponentType } from 'react';

import { useStoreState } from '../../store/hooks';
import { getNodesInside } from '../../utils/graph';
import { Node, Transform, NodeTypesType, WrapNodeProps, Elements, Edge } from '../../types';

interface NodeRendererProps {
  nodeTypes: NodeTypesType;
  selectNodesOnDrag: boolean;
  onElementClick?: (element: Node | Edge) => void;
  onNodeDragStart?: (node: Node) => void;
  onNodeDragStop?: (node: Node) => void;
  onlyRenderVisibleNodes?: boolean;
}

function renderNode(
  node: Node,
  props: NodeRendererProps,
  transform: Transform,
  selectedElements: Elements | null,
  isInteractive: boolean
) {
  const nodeType = node.type || 'default';
  const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default) as ComponentType<WrapNodeProps>;
  if (!props.nodeTypes[nodeType]) {
    console.warn(`Node type "${nodeType}" not found. Using fallback type "default".`);
  }

  const isSelected = selectedElements ? selectedElements.some(({ id }) => id === node.id) : false;

  return (
    <NodeComponent
      key={node.id}
      id={node.id}
      type={nodeType}
      data={node.data}
      xPos={node.__rf.position.x}
      yPos={node.__rf.position.y}
      onClick={props.onElementClick}
      onNodeDragStart={props.onNodeDragStart}
      onNodeDragStop={props.onNodeDragStop}
      transform={transform}
      selected={isSelected}
      style={node.style}
      className={node.className}
      isInteractive={isInteractive}
      sourcePosition={node.sourcePosition}
      targetPosition={node.targetPosition}
      selectNodesOnDrag={props.selectNodesOnDrag}
    />
  );
}

const NodeRenderer = memo(({ onlyRenderVisibleNodes = true, ...props }: NodeRendererProps) => {
  const nodes = useStoreState((s) => s.nodes);
  const transform = useStoreState((s) => s.transform);
  const selectedElements = useStoreState((s) => s.selectedElements);
  const width = useStoreState((s) => s.width);
  const height = useStoreState((s) => s.height);
  const isInteractive = useStoreState((s) => s.isInteractive);
  const [tX, tY, tScale] = transform;
  const transformStyle = {
    transform: `translate(${tX}px,${tY}px) scale(${tScale})`,
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

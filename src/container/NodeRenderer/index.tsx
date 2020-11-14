import React, { memo, useMemo, ComponentType, MouseEvent } from 'react';

import { useStoreState } from '../../store/hooks';
import { Node, NodeTypesType, WrapNodeProps, Edge } from '../../types';

interface NodeRendererProps {
  nodeTypes: NodeTypesType;
  selectNodesOnDrag: boolean;
  onElementClick?: (event: MouseEvent, element: Node | Edge) => void;
  onNodeMouseEnter?: (event: MouseEvent, node: Node) => void;
  onNodeMouseMove?: (event: MouseEvent, node: Node) => void;
  onNodeMouseLeave?: (event: MouseEvent, node: Node) => void;
  onNodeContextMenu?: (event: MouseEvent, node: Node) => void;
  onNodeDragStart?: (event: MouseEvent, node: Node) => void;
  onNodeDragStop?: (event: MouseEvent, node: Node) => void;
  snapToGrid: boolean;
  snapGrid: [number, number];
}

const NodeRenderer = (props: NodeRendererProps) => {
  const transform = useStoreState((state) => state.transform);
  const selectedElements = useStoreState((state) => state.selectedElements);
  const nodesDraggable = useStoreState((state) => state.nodesDraggable);
  const nodesConnectable = useStoreState((state) => state.nodesConnectable);
  const elementsSelectable = useStoreState((state) => state.elementsSelectable);
  const visibleNodes = useStoreState((state) => state.visibleNodes);

  const transformStyle = useMemo(
    () => ({
      transform: `translate(${transform[0]}px,${transform[1]}px) scale(${transform[2]})`,
    }),
    [transform[0], transform[1], transform[2]]
  );

  return (
    <div className="react-flow__nodes" style={transformStyle}>
      {visibleNodes.map((node) => {
        const nodeType = node.type || 'default';
        const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default) as ComponentType<WrapNodeProps>;

        if (!props.nodeTypes[nodeType]) {
          console.warn(`Node type "${nodeType}" not found. Using fallback type "default".`);
        }

        const isDraggable = !!(node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'));
        const isSelectable = !!(node.selectable || (elementsSelectable && typeof node.selectable === 'undefined'));
        const isConnectable = !!(node.connectable || (nodesConnectable && typeof node.connectable === 'undefined'));

        return (
          <NodeComponent
            key={node.id}
            id={node.id}
            className={node.className}
            style={node.style}
            type={nodeType}
            data={node.data}
            sourcePosition={node.sourcePosition}
            targetPosition={node.targetPosition}
            isHidden={node.isHidden}
            xPos={node.__rf.position.x}
            yPos={node.__rf.position.y}
            isDragging={node.__rf.isDragging}
            isInitialized={node.__rf.width !== null && node.__rf.height !== null}
            snapGrid={props.snapGrid}
            snapToGrid={props.snapToGrid}
            selectNodesOnDrag={props.selectNodesOnDrag}
            onClick={props.onElementClick}
            onMouseEnter={props.onNodeMouseEnter}
            onMouseMove={props.onNodeMouseMove}
            onMouseLeave={props.onNodeMouseLeave}
            onContextMenu={props.onNodeContextMenu}
            onNodeDragStart={props.onNodeDragStart}
            onNodeDragStop={props.onNodeDragStop}
            scale={transform[2]}
            selected={selectedElements?.some(({ id }) => id === node.id) || false}
            isDraggable={isDraggable}
            isSelectable={isSelectable}
            isConnectable={isConnectable}
          />
        );
      })}
    </div>
  );
};

NodeRenderer.displayName = 'NodeRenderer';

export default memo(NodeRenderer);

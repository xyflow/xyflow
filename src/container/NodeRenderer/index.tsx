import React, { memo, useMemo, ComponentType, MouseEvent, useCallback } from 'react';
import shallow from 'zustand/shallow';

import { useStore } from '../../store';
import { Node, NodeTypesType, ReactFlowState, WrapNodeProps } from '../../types';
import { getNodesInside } from '../../utils/graph';
interface NodeRendererProps {
  nodeTypes: NodeTypesType;
  selectNodesOnDrag: boolean;
  onNodeClick?: (event: MouseEvent, element: Node) => void;
  onNodeDoubleClick?: (event: MouseEvent, element: Node) => void;
  onNodeMouseEnter?: (event: MouseEvent, node: Node) => void;
  onNodeMouseMove?: (event: MouseEvent, node: Node) => void;
  onNodeMouseLeave?: (event: MouseEvent, node: Node) => void;
  onNodeContextMenu?: (event: MouseEvent, node: Node) => void;
  onNodeDragStart?: (event: MouseEvent, node: Node) => void;
  onNodeDrag?: (event: MouseEvent, node: Node) => void;
  onNodeDragStop?: (event: MouseEvent, node: Node) => void;
  onlyRenderVisibleElements: boolean;
}

const selector = (s: ReactFlowState) => ({
  transform: s.transform,
  nodesDraggable: s.nodesDraggable,
  nodesConnectable: s.nodesConnectable,
  elementsSelectable: s.elementsSelectable,
  updateNodeDimensions: s.updateNodeDimensions,
  snapGrid: s.snapGrid,
  snapToGrid: s.snapToGrid,
});

const NodeRenderer = (props: NodeRendererProps) => {
  const {
    transform,
    nodesDraggable,
    nodesConnectable,
    elementsSelectable,
    updateNodeDimensions,
    snapGrid,
    snapToGrid,
  } = useStore(selector, shallow);

  const nodes = useStore(
    useCallback(
      (s: ReactFlowState) => {
        return props.onlyRenderVisibleElements
          ? getNodesInside(s.nodes, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true)
          : s.nodes;
      },
      [props.onlyRenderVisibleElements]
    )
  );

  const transformStyle = useMemo(
    () => ({
      transform: `translate(${transform[0]}px,${transform[1]}px) scale(${transform[2]})`,
    }),
    [transform[0], transform[1], transform[2]]
  );

  const resizeObserver = useMemo(() => {
    if (typeof ResizeObserver === 'undefined') {
      return null;
    }

    return new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const updates = entries.map((entry: ResizeObserverEntry) => ({
        id: entry.target.getAttribute('data-id') as string,
        nodeElement: entry.target as HTMLDivElement,
      }));

      updateNodeDimensions(updates);
    });
  }, []);

  return (
    <div className="react-flow__nodes" style={transformStyle}>
      {nodes.map((node) => {
        const nodeType = node.type || 'default';
        const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default) as ComponentType<WrapNodeProps>;

        if (!props.nodeTypes[nodeType]) {
          console.warn(`Node type "${nodeType}" not found. Using fallback type "default".`);
        }

        const isDraggable = !!(node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'));
        const isSelectable = !!(node.selectable || (elementsSelectable && typeof node.selectable === 'undefined'));
        const isConnectable = !!(node.connectable || (nodesConnectable && typeof node.connectable === 'undefined'));
        const isInitialized =
          node.width !== null &&
          node.height !== null &&
          typeof node.width !== 'undefined' &&
          typeof node.height !== 'undefined';

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
            xPos={node.position.x}
            yPos={node.position.y}
            isDragging={node.isDragging}
            isInitialized={isInitialized}
            snapGrid={snapGrid}
            snapToGrid={snapToGrid}
            selectNodesOnDrag={props.selectNodesOnDrag}
            onClick={props.onNodeClick}
            onMouseEnter={props.onNodeMouseEnter}
            onMouseMove={props.onNodeMouseMove}
            onMouseLeave={props.onNodeMouseLeave}
            onContextMenu={props.onNodeContextMenu}
            onNodeDoubleClick={props.onNodeDoubleClick}
            onNodeDragStart={props.onNodeDragStart}
            onNodeDrag={props.onNodeDrag}
            onNodeDragStop={props.onNodeDragStop}
            scale={transform[2]}
            isSelected={!!node.isSelected}
            isDraggable={isDraggable}
            isSelectable={isSelectable}
            isConnectable={isConnectable}
            resizeObserver={resizeObserver}
            dragHandle={node.dragHandle}
          />
        );
      })}
    </div>
  );
};

NodeRenderer.displayName = 'NodeRenderer';

export default memo(NodeRenderer);

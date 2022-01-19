import React, { memo, useMemo, ComponentType, MouseEvent, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';

import useVisibleNodes from '../../hooks/useVisibleNodes';
import { useStore } from '../../store';
import { Node, NodeTypesType, ReactFlowState, WrapNodeProps } from '../../types';

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
  noPanClassName: string;
  noDragClassName: string;
}

const selector = (s: ReactFlowState) => ({
  scale: s.transform[2],
  nodesDraggable: s.nodesDraggable,
  nodesConnectable: s.nodesConnectable,
  elementsSelectable: s.elementsSelectable,
  updateNodeDimensions: s.updateNodeDimensions,
  snapGrid: s.snapGrid,
  snapToGrid: s.snapToGrid,
  nodeInternals: s.nodeInternals,
});

const NodeRenderer = (props: NodeRendererProps) => {
  const { scale, nodesDraggable, nodesConnectable, elementsSelectable, updateNodeDimensions, snapGrid, snapToGrid } =
    useStore(selector, shallow);
  const nodes = useVisibleNodes(props.onlyRenderVisibleElements);
  const reseizeObserverRef = useRef<ResizeObserver>();

  const resizeObserver = useMemo(() => {
    if (typeof ResizeObserver === 'undefined') {
      return null;
    }

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const updates = entries.map((entry: ResizeObserverEntry) => ({
        id: entry.target.getAttribute('data-id') as string,
        nodeElement: entry.target as HTMLDivElement,
        forceUpdate: true,
      }));

      updateNodeDimensions(updates);
    });

    reseizeObserverRef.current = observer;

    return observer;
  }, []);

  useEffect(() => {
    return () => {
      reseizeObserverRef?.current?.disconnect();
    };
  }, []);

  return (
    <div className="react-flow__nodes react-flow__container">
      {nodes.map((node) => {
        const nodeType = node.type || 'default';

        if (!props.nodeTypes[nodeType]) {
          console.warn(`Node type "${nodeType}" not found. Using fallback type "default".`);
        }

        const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default) as ComponentType<WrapNodeProps>;
        const isDraggable = !!(node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'));
        const isSelectable = !!(node.selectable || (elementsSelectable && typeof node.selectable === 'undefined'));
        const isConnectable = !!(node.connectable || (nodesConnectable && typeof node.connectable === 'undefined'));
        const isInitialized =
          node.width && node.height && typeof node.width !== 'undefined' && typeof node.height !== 'undefined';

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
            hidden={node.hidden}
            xPos={node.positionAbsolute?.x ?? 0}
            yPos={node.positionAbsolute?.y ?? 0}
            dragging={!!node.dragging}
            isInitialized={!!isInitialized}
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
            scale={scale}
            selected={!!node.selected}
            isDraggable={isDraggable}
            isSelectable={isSelectable}
            isConnectable={isConnectable}
            resizeObserver={resizeObserver}
            dragHandle={node.dragHandle}
            zIndex={node.z ?? 0}
            isParent={!!node.isParent}
            noDragClassName={props.noDragClassName}
            noPanClassName={props.noPanClassName}
          />
        );
      })}
    </div>
  );
};

NodeRenderer.displayName = 'NodeRenderer';

export default memo(NodeRenderer);

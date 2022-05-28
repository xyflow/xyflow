import React, { memo, useMemo, ComponentType, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';

import useVisibleNodes from '../../hooks/useVisibleNodes';
import { useStore } from '../../store';
import {
  NodeDragHandler,
  NodeMouseHandler,
  NodeTypesWrapped,
  Position,
  ReactFlowState,
  WrapNodeProps,
} from '../../types';
import { internalsSymbol } from '../../utils';

interface NodeRendererProps {
  nodeTypes: NodeTypesWrapped;
  selectNodesOnDrag: boolean;
  onNodeClick?: NodeMouseHandler;
  onNodeDoubleClick?: NodeMouseHandler;
  onNodeMouseEnter?: NodeMouseHandler;
  onNodeMouseMove?: NodeMouseHandler;
  onNodeMouseLeave?: NodeMouseHandler;
  onNodeContextMenu?: NodeMouseHandler;
  onNodeDragStart?: NodeDragHandler;
  onNodeDrag?: NodeDragHandler;
  onNodeDragStop?: NodeDragHandler;
  onlyRenderVisibleElements: boolean;
  noPanClassName: string;
  noDragClassName: string;
}

const selector = (s: ReactFlowState) => ({
  nodesDraggable: s.nodesDraggable,
  nodesConnectable: s.nodesConnectable,
  elementsSelectable: s.elementsSelectable,
  updateNodeDimensions: s.updateNodeDimensions,
});

const NodeRenderer = (props: NodeRendererProps) => {
  const { nodesDraggable, nodesConnectable, elementsSelectable, updateNodeDimensions } = useStore(selector, shallow);
  const nodes = useVisibleNodes(props.onlyRenderVisibleElements);
  const resizeObserverRef = useRef<ResizeObserver>();

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

    resizeObserverRef.current = observer;

    return observer;
  }, []);

  useEffect(() => {
    return () => {
      resizeObserverRef?.current?.disconnect();
    };
  }, []);

  return (
    <div className="react-flow__nodes react-flow__container">
      {nodes.map((node) => {
        let nodeType = node.type || 'default';

        if (!props.nodeTypes[nodeType]) {
          // @ts-ignore
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              `[React Flow]: Node type "${nodeType}" not found. Using fallback type "default". Help: https://reactflow.dev/error#300`
            );
          }

          nodeType = 'default';
        }

        const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default) as ComponentType<WrapNodeProps>;
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
            sourcePosition={node.sourcePosition || Position.Bottom}
            targetPosition={node.targetPosition || Position.Top}
            hidden={node.hidden}
            xPos={node.positionAbsolute?.x ?? 0}
            yPos={node.positionAbsolute?.y ?? 0}
            selectNodesOnDrag={props.selectNodesOnDrag}
            onClick={props.onNodeClick}
            onMouseEnter={props.onNodeMouseEnter}
            onMouseMove={props.onNodeMouseMove}
            onMouseLeave={props.onNodeMouseLeave}
            onContextMenu={props.onNodeContextMenu}
            onDoubleClick={props.onNodeDoubleClick}
            onDragStart={props.onNodeDragStart}
            onDrag={props.onNodeDrag}
            onDragStop={props.onNodeDragStop}
            selected={!!node.selected}
            isDraggable={isDraggable}
            isSelectable={isSelectable}
            isConnectable={isConnectable}
            resizeObserver={resizeObserver}
            dragHandle={node.dragHandle}
            zIndex={node[internalsSymbol]?.z ?? 0}
            isParent={!!node[internalsSymbol]?.isParent}
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

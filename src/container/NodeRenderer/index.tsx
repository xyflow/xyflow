import React, { memo, useMemo, ComponentType, MouseEvent } from 'react';
import shallow from 'zustand/shallow';

import { useStore } from '../../store';
import { Node, NodeTypesType, ReactFlowState, WrapNodeProps, SnapGrid, NodeRendererNode } from '../../types';
import useVisibleNodes from '../../hooks/useVisibleNodes';
import useNodeLookup from '../../hooks/useNodeLookup';
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
  nodeLookup: s.nodeLookup,
});

interface NodeProps extends NodeRendererProps {
  node: Node;
  nodeType: string;
  childNodes?: NodeRendererNode[];
  xPos?: number;
  yPos?: number;
  isDraggable?: boolean;
  resizeObserver: ResizeObserver | null;
  scale: number;
  snapToGrid: boolean;
  snapGrid: SnapGrid;
  nodesDraggable: boolean;
  nodesConnectable: boolean;
  elementsSelectable: boolean;
  treeLevel?: number;
  isParentNode?: boolean;
}

function Node({
  node,
  childNodes,
  nodeType,
  isDraggable,
  resizeObserver,
  scale,
  snapToGrid,
  snapGrid,
  nodesDraggable,
  nodesConnectable,
  elementsSelectable,
  treeLevel = 0,
  xPos,
  yPos,
  isParentNode = false,
  ...props
}: NodeProps) {
  // const onNodesChange = useStore((s) => s.onNodesChange);
  const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default) as ComponentType<WrapNodeProps>;
  const isNodeDraggable =
    typeof isDraggable !== 'undefined'
      ? isDraggable
      : !!(node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'));
  const isSelectable = !!(node.selectable || (elementsSelectable && typeof node.selectable === 'undefined'));
  const isConnectable = !!(node.connectable || (nodesConnectable && typeof node.connectable === 'undefined'));
  const isInitialized =
    node.width !== null &&
    node.height !== null &&
    typeof node.width !== 'undefined' &&
    typeof node.height !== 'undefined';

  return (
    <NodeComponent
      id={node.id}
      className={node.className}
      style={node.style}
      type={nodeType}
      data={node.data}
      sourcePosition={node.sourcePosition}
      targetPosition={node.targetPosition}
      isHidden={node.isHidden}
      xPos={xPos || 0}
      yPos={yPos || 0}
      width={node.width}
      height={node.height}
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
      scale={scale}
      isSelected={!!node.isSelected}
      isDraggable={isNodeDraggable}
      isSelectable={isSelectable}
      isConnectable={isConnectable}
      resizeObserver={resizeObserver}
      dragHandle={node.dragHandle}
      zIndex={6 + treeLevel}
      isParentNode={isParentNode}
    />
  );
}

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

  const nodeLookup = useNodeLookup();
  const nodes = useVisibleNodes(props.onlyRenderVisibleElements);

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
    <div className="react-flow__nodes">
      {nodes.map((node) => {
        const nodeType = node.type || 'default';
        const lookupNode = nodeLookup.get(node.id);

        if (!props.nodeTypes[nodeType]) {
          console.warn(`Node type "${nodeType}" not found. Using fallback type "default".`);
        }

        return (
          <Node
            key={node.id}
            node={node}
            nodeType={nodeType}
            snapToGrid={snapToGrid}
            snapGrid={snapGrid}
            nodesDraggable={nodesDraggable}
            nodesConnectable={nodesConnectable}
            resizeObserver={resizeObserver}
            elementsSelectable={elementsSelectable}
            scale={transform[2]}
            xPos={lookupNode?.positionAbsolute?.x}
            yPos={lookupNode?.positionAbsolute?.y}
            treeLevel={lookupNode?.treeLevel}
            isParentNode={lookupNode?.isParentNode}
            {...props}
          />
        );
      })}
    </div>
  );
};

NodeRenderer.displayName = 'NodeRenderer';

export default memo(NodeRenderer);

import React, { memo, useMemo, ComponentType, MouseEvent, Fragment } from 'react';
import shallow from 'zustand/shallow';

import { useStore } from '../../store';
import { Node, NodeTypesType, ReactFlowState, WrapNodeProps, SnapGrid } from '../../types';
import useVisibleNodes from '../../hooks/useVisibleNodes';
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

interface NodesProps extends NodeRendererProps {
  nodes: Node[];
  isDraggable?: boolean;
  resizeObserver: ResizeObserver | null;
  scale: number;
  snapToGrid: boolean;
  snapGrid: SnapGrid;
  nodesDraggable: boolean;
  nodesConnectable: boolean;
  elementsSelectable: boolean;
  recursionDepth: number;
  parentId?: string;
}

interface NodeProps extends Omit<NodesProps, 'nodes'> {
  node: Node;
  nodeType: string;
}

function Node({
  node,
  nodeType,
  isDraggable,
  resizeObserver,
  scale,
  snapToGrid,
  snapGrid,
  nodesDraggable,
  nodesConnectable,
  elementsSelectable,
  recursionDepth,
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

  const isParentNode = !!node.childNodes?.length;

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
      xPos={node.position.x}
      yPos={node.position.y}
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
      zIndex={3 + recursionDepth}
      isParentNode={isParentNode}
    />
  );
}

function Nodes({
  nodes,
  isDraggable,
  resizeObserver,
  scale,
  snapToGrid,
  snapGrid,
  nodesDraggable,
  nodesConnectable,
  elementsSelectable,
  recursionDepth,
  ...props
}: NodesProps): any {
  return nodes.map((node) => {
    const nodeType = node.type || 'default';

    if (!props.nodeTypes[nodeType]) {
      console.warn(`Node type "${nodeType}" not found. Using fallback type "default".`);
    }

    return (
      <Fragment key={node.id}>
        <Node
          node={node}
          nodeType={nodeType}
          parentId={node.id}
          snapToGrid={snapToGrid}
          snapGrid={snapGrid}
          nodesDraggable={nodesDraggable}
          nodesConnectable={nodesConnectable}
          resizeObserver={resizeObserver}
          elementsSelectable={elementsSelectable}
          scale={scale}
          recursionDepth={recursionDepth}
          {...props}
        />
        {node.childNodes && node.childNodes.length > 0 && (
          <MemoizedNodes
            nodes={node.childNodes}
            parentId={node.id}
            snapToGrid={snapToGrid}
            snapGrid={snapGrid}
            nodesDraggable={nodesDraggable}
            nodesConnectable={nodesConnectable}
            resizeObserver={resizeObserver}
            elementsSelectable={elementsSelectable}
            scale={scale}
            recursionDepth={recursionDepth + 1}
            {...props}
          />
        )}
      </Fragment>
    );
  });
}

const MemoizedNodes = memo(Nodes);

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
  const nodes = useVisibleNodes(props.onlyRenderVisibleElements);

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
      <MemoizedNodes
        nodes={nodes}
        snapToGrid={snapToGrid}
        snapGrid={snapGrid}
        nodesDraggable={nodesDraggable}
        nodesConnectable={nodesConnectable}
        resizeObserver={resizeObserver}
        elementsSelectable={elementsSelectable}
        scale={transform[2]}
        recursionDepth={0}
        {...props}
      />
    </div>
  );
};

NodeRenderer.displayName = 'NodeRenderer';

export default memo(NodeRenderer);

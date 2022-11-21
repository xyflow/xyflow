/**
 * The user selection rectangle gets displayed when a user drags the mouse while pressing shift
 */

import { memo, useState, useRef } from 'react';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { getSelectionChanges } from '../../utils/changes';
import { getConnectedEdges, getNodesInside } from '../../utils/graph';
import type { XYPosition, ReactFlowState, NodeChange, EdgeChange, Rect } from '../../types';

type SelectionRect = Rect & {
  startX: number;
  startY: number;
  draw: boolean;
};

type UserSelectionProps = {
  selectionKeyPressed: boolean;
};

function getMousePosition(event: React.MouseEvent, containerBounds: DOMRect): XYPosition {
  return {
    x: event.clientX - containerBounds.left,
    y: event.clientY - containerBounds.top,
  };
}

const selector = (s: ReactFlowState) => ({
  userSelectionActive: s.userSelectionActive,
  elementsSelectable: s.elementsSelectable,
});

const initialRect: SelectionRect = {
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  draw: false,
};

const UserSelection = memo(({ selectionKeyPressed }: UserSelectionProps) => {
  const store = useStoreApi();
  const prevSelectedNodesCount = useRef<number>(0);
  const prevSelectedEdgesCount = useRef<number>(0);
  const containerBounds = useRef<DOMRect>();
  const [userSelectionRect, setUserSelectionRect] = useState<SelectionRect>(initialRect);
  const { userSelectionActive, elementsSelectable } = useStore(selector, shallow);

  const renderUserSelectionPane = userSelectionActive || selectionKeyPressed;

  if (!elementsSelectable || !renderUserSelectionPane) {
    return null;
  }

  const resetUserSelection = () => {
    setUserSelectionRect(initialRect);

    store.setState({ userSelectionActive: false });

    prevSelectedNodesCount.current = 0;
    prevSelectedEdgesCount.current = 0;
  };

  const onMouseDown = (event: React.MouseEvent): void => {
    const reactFlowNode = (event.target as Element).closest('.react-flow')!;
    containerBounds.current = reactFlowNode.getBoundingClientRect();

    const mousePos = getMousePosition(event, containerBounds.current!);

    setUserSelectionRect({
      width: 0,
      height: 0,
      startX: mousePos.x,
      startY: mousePos.y,
      x: mousePos.x,
      y: mousePos.y,
      draw: true,
    });

    store.setState({ userSelectionActive: true, nodesSelectionActive: false });
  };

  const onMouseMove = (event: React.MouseEvent): void => {
    if (!selectionKeyPressed || !userSelectionRect.draw || !containerBounds.current) {
      return;
    }

    const mousePos = getMousePosition(event, containerBounds.current!);
    const startX = userSelectionRect.startX ?? 0;
    const startY = userSelectionRect.startY ?? 0;

    const nextUserSelectRect = {
      ...userSelectionRect,
      x: mousePos.x < startX ? mousePos.x : startX,
      y: mousePos.y < startY ? mousePos.y : startY,
      width: Math.abs(mousePos.x - startX),
      height: Math.abs(mousePos.y - startY),
    };

    const { nodeInternals, edges, transform, onNodesChange, onEdgesChange, nodeOrigin } = store.getState();
    const nodes = Array.from(nodeInternals.values());
    const selectedNodes = getNodesInside(nodeInternals, nextUserSelectRect, transform, false, true, nodeOrigin);
    const selectedEdgeIds = getConnectedEdges(selectedNodes, edges).map((e) => e.id);
    const selectedNodeIds = selectedNodes.map((n) => n.id);

    if (prevSelectedNodesCount.current !== selectedNodeIds.length) {
      prevSelectedNodesCount.current = selectedNodeIds.length;
      const changes = getSelectionChanges(nodes, selectedNodeIds) as NodeChange[];
      if (changes.length) {
        onNodesChange?.(changes);
      }
    }

    if (prevSelectedEdgesCount.current !== selectedEdgeIds.length) {
      prevSelectedEdgesCount.current = selectedEdgeIds.length;
      const changes = getSelectionChanges(edges, selectedEdgeIds) as EdgeChange[];
      if (changes.length) {
        onEdgesChange?.(changes);
      }
    }

    setUserSelectionRect(nextUserSelectRect);
  };

  const onMouseUp = () => {
    store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });
    resetUserSelection();
  };

  const onMouseLeave = () => {
    store.setState({ nodesSelectionActive: false });
    resetUserSelection();
  };

  return (
    <div
      className="react-flow__selectionpane react-flow__container"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {userSelectionRect.draw && (
        <div
          className="react-flow__selection react-flow__container"
          style={{
            width: userSelectionRect.width,
            height: userSelectionRect.height,
            transform: `translate(${userSelectionRect.x}px, ${userSelectionRect.y}px)`,
          }}
        />
      )}
    </div>
  );
});

UserSelection.displayName = 'UserSelection';

export default UserSelection;

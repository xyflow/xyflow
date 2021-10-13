/**
 * The user selection rectangle gets displayed when a user drags the mouse while pressing shift
 */

import React, { memo } from 'react';

import { useStore } from '../../store';
import { XYPosition, ReactFlowState } from '../../types';

type UserSelectionProps = {
  selectionKeyPressed: boolean;
};

function getMousePosition(event: React.MouseEvent): XYPosition | void {
  const reactFlowNode = (event.target as Element).closest('.react-flow');
  if (!reactFlowNode) {
    return;
  }

  const containerBounds = reactFlowNode.getBoundingClientRect();

  return {
    x: event.clientX - containerBounds.left,
    y: event.clientY - containerBounds.top,
  };
}

const userSelectionRectSelector = (state: ReactFlowState) => state.userSelectionRect;

const SelectionRect = () => {
  const userSelectionRect = useStore(userSelectionRectSelector);

  if (!userSelectionRect.draw) {
    return null;
  }

  return (
    <div
      className="react-flow__selection"
      style={{
        width: userSelectionRect.width,
        height: userSelectionRect.height,
        transform: `translate(${userSelectionRect.x}px, ${userSelectionRect.y}px)`,
      }}
    />
  );
};

const selector = (s: ReactFlowState) => ({
  selectionActive: s.selectionActive,
  elementsSelectable: s.elementsSelectable,
  setUserSelection: s.setUserSelection,
  updateUserSelection: s.updateUserSelection,
  unsetUserSelection: s.unsetUserSelection,
  unsetNodesSelection: s.unsetNodesSelection,
});

export default memo(({ selectionKeyPressed }: UserSelectionProps) => {
  const {
    selectionActive,
    elementsSelectable,
    setUserSelection,
    updateUserSelection,
    unsetUserSelection,
    unsetNodesSelection,
  } = useStore(selector);

  const renderUserSelectionPane = selectionActive || selectionKeyPressed;

  if (!elementsSelectable || !renderUserSelectionPane) {
    return null;
  }

  const onMouseDown = (event: React.MouseEvent): void => {
    const mousePos = getMousePosition(event);
    if (!mousePos) {
      return;
    }

    setUserSelection(mousePos);
  };

  const onMouseMove = (event: React.MouseEvent): void => {
    if (!selectionKeyPressed || !selectionActive) {
      return;
    }
    const mousePos = getMousePosition(event);

    if (!mousePos) {
      return;
    }

    updateUserSelection(mousePos);
  };

  const onMouseUp = () => unsetUserSelection();

  const onMouseLeave = () => {
    unsetUserSelection();
    unsetNodesSelection();
  };

  return (
    <div
      className="react-flow__selectionpane"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <SelectionRect />
    </div>
  );
});

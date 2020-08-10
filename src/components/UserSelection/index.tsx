/**
 * The user selection rectangle gets displayed when a user drags the mouse while pressing shift
 */

import React, { memo, useEffect } from 'react';

import { useStoreActions, useStoreState } from '../../store/hooks';
import { XYPosition } from '../../types';

type UserSelectionProps = {
  selectionKeyPressed: boolean;
};

function getMousePosition(event: React.MouseEvent): XYPosition | void {
  const reactFlowNode = document.querySelector('.react-flow');
  if (!reactFlowNode) {
    return;
  }

  const containerBounds = reactFlowNode.getBoundingClientRect();

  return {
    x: event.clientX - containerBounds.left,
    y: event.clientY - containerBounds.top,
  };
}

const SelectionRect = () => {
  const userSelectionRect = useStoreState((state) => state.userSelectionRect);

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

export default memo(({ selectionKeyPressed }: UserSelectionProps) => {
  const selectionActive = useStoreState((state) => state.selectionActive);
  const elementsSelectable = useStoreState((state) => state.elementsSelectable);

  const setUserSelection = useStoreActions((actions) => actions.setUserSelection);
  const updateUserSelection = useStoreActions((actions) => actions.updateUserSelection);
  const unsetUserSelection = useStoreActions((actions) => actions.unsetUserSelection);
  const renderUserSelectionPane = selectionActive || selectionKeyPressed;

  useEffect(() => {
    if (!selectionKeyPressed) {
      unsetUserSelection();
    }
  }, [selectionKeyPressed]);

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

  return (
    <div
      className="react-flow__selectionpane"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <SelectionRect />
    </div>
  );
});

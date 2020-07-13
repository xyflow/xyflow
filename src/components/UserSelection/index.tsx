/**
 * The user selection rectangle gets displayed when a user drags the mouse while pressing shift
 */

import React, { memo, useEffect } from 'react';

import { useStoreActions, useStoreState } from '../../store/hooks';
import { XYPosition } from '../../types';

type UserSelectionProps = {
  selectionKeyPressed: boolean;
};

function getMousePosition(evt: React.MouseEvent): XYPosition | void {
  const reactFlowNode = document.querySelector('.react-flow');
  if (!reactFlowNode) {
    return;
  }

  const containerBounds = reactFlowNode.getBoundingClientRect();

  return {
    x: evt.clientX - containerBounds.left,
    y: evt.clientY - containerBounds.top,
  };
}

const SelectionRect = () => {
  const userSelectionRect = useStoreState((s) => s.userSelectionRect);

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
  const selectionActive = useStoreState((s) => s.selectionActive);
  const elementsSelectable = useStoreState((s) => s.elementsSelectable);

  const setUserSelection = useStoreActions((a) => a.setUserSelection);
  const updateUserSelection = useStoreActions((a) => a.updateUserSelection);
  const unsetUserSelection = useStoreActions((a) => a.unsetUserSelection);
  const renderUserSelectionPane = selectionActive || selectionKeyPressed;

  useEffect(() => {
    if (!selectionKeyPressed) {
      unsetUserSelection();
    }
  }, [selectionKeyPressed]);

  if (!elementsSelectable || !renderUserSelectionPane) {
    return null;
  }

  const onMouseDown = (evt: React.MouseEvent): void => {
    const mousePos = getMousePosition(evt);
    if (!mousePos) {
      return;
    }

    setUserSelection(mousePos);
  };

  const onMouseMove = (evt: React.MouseEvent): void => {
    if (!selectionKeyPressed || !selectionActive) {
      return;
    }
    const mousePos = getMousePosition(evt);

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

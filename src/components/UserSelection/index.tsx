import React, { useEffect, useRef, useState, memo, MouseEvent } from 'react';

import { useStoreActions } from '../../store/hooks';
import { SelectionRect } from '../../types';

const initialRect: SelectionRect = {
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  draw: false
};

function getMousePosition(evt: MouseEvent) {
  const reactFlowNode = document.querySelector('.react-flow');
  if (!reactFlowNode) {
    return false;
  }

  const containerBounds = reactFlowNode.getBoundingClientRect();

  return {
    x: evt.clientX - containerBounds.left,
    y: evt.clientY - containerBounds.top,
  };
}

export default memo(() => {
  const selectionPane = useRef(null);
  const [rect, setRect] = useState(initialRect);
  const setSelection = useStoreActions(a => a.setSelection);
  const updateSelection = useStoreActions(a => a.updateSelection);
  const setNodesSelection = useStoreActions(a => a.setNodesSelection);

  useEffect(() => {
    function onMouseDown(evt: MouseEvent) {
      const mousePos = getMousePosition(evt);
      if (!mousePos) {
        return false;
      }

      setRect((currentRect) => ({
        ...currentRect,
        startX: mousePos.x,
        startY: mousePos.y,
        x: mousePos.x,
        y: mousePos.y,
        draw: true
      }));

      setSelection(true);
    }

    function onMouseMove(evt: MouseEvent) {
      setRect((currentRect) => {
        if (!currentRect.draw) {
          return currentRect;
        }

        const mousePos = getMousePosition(evt);
        if (!mousePos) {
          return currentRect;
        }

        const negativeX = mousePos.x < currentRect.startX;
        const negativeY = mousePos.y < currentRect.startY;
        const nextRect = {
          ...currentRect,
          x: negativeX ? mousePos.x : currentRect.x,
          y: negativeY ? mousePos.y : currentRect.y,
          width: negativeX ? currentRect.startX - mousePos.x : mousePos.x - currentRect.startX,
          height: negativeY ? currentRect.startY - mousePos.y : mousePos.y - currentRect.startY,
        };

        updateSelection(nextRect);

        return nextRect;
      });
    }

    function onMouseUp() {
      setRect((currentRect) => {
        setNodesSelection({ isActive: true, selection: currentRect });
        setSelection(false);

        return {
          ...currentRect,
          draw: false
        };
      });
    }

    selectionPane.current.addEventListener('mousedown', onMouseDown);
    selectionPane.current.addEventListener('mousemove', onMouseMove);
    selectionPane.current.addEventListener('mouseup', onMouseUp);

    return () => {
      selectionPane.current.removeEventListener('mousedown', onMouseDown);
      selectionPane.current.removeEventListener('mousemove', onMouseMove);
      selectionPane.current.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div
      className="react-flow__selectionpane"
      ref={selectionPane}
    >
      {rect.draw && (
        <div
          className="react-flow__selection"
          style={{
            width: rect.width,
            height: rect.height,
            transform: `translate(${rect.x}px, ${rect.y}px)`
          }}
        />
      )}
    </div>
  );
});

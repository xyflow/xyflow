import React, { useEffect, useRef, useState, memo } from 'react';
import { useStoreActions } from 'easy-peasy';

const initialRect = {
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  draw: false
};

function getMousePosition(evt) {
  const containerBounds = document.querySelector('.react-graph').getBoundingClientRect();

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
    function onMouseDown(evt) {
      const mousePos = getMousePosition(evt);

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

    function onMouseMove(evt) {
      setRect((currentRect) => {
        if (!currentRect.draw) {
          return currentRect;
        }

        const mousePos = getMousePosition(evt);
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
      className="react-graph__selectionpane"
      ref={selectionPane}
    >
      {(rect.draw || rect.fixed) && (
        <div
          className="react-graph__selection"
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

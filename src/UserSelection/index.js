import React, { useEffect, useRef, useState, useContext } from 'react';

import { GraphContext } from '../GraphContext';
import { updateSelection, setSelection, setNodesSelection } from '../state/actions';

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

export default () => {
  const selectionPane = useRef(null);
  const [rect, setRect] = useState(initialRect);
  const { dispatch } = useContext(GraphContext);

  useEffect(() => {
    function onMouseDown(evt) {
      const mousePos = getMousePosition(evt);

      setRect((r) => ({
        ...r,
        startX: mousePos.x,
        startY: mousePos.y,
        x: mousePos.x,
        y: mousePos.y,
        draw: true
      }));

      dispatch(setSelection(true));
    }

    function onMouseMove(evt) {
      setRect((r) => {
        if (!r.draw) {
          return r;
        }

        const mousePos = getMousePosition(evt);
        const negativeX = mousePos.x < r.startX;
        const negativeY = mousePos.y < r.startY;
        const nextRect = {
          ...r,
          x: negativeX ? mousePos.x : r.x,
          y: negativeY ? mousePos.y : r.y,
          width: negativeX ? r.startX - mousePos.x : mousePos.x - r.startX,
          height: negativeY ? r.startY - mousePos.y : mousePos.y - r.startY,
        };

        dispatch(updateSelection(nextRect));

        return nextRect;
      });
    }

    function onMouseUp() {
      setRect((r) => {
        const nextRect = {
          ...r,
          fixed: true
        };

        dispatch(setNodesSelection({ isActive: true, selection: nextRect }));
        dispatch(setSelection(false));

        return nextRect;
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
}
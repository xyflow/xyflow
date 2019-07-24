import React, { useEffect, useRef, useState, useContext } from 'react';

import { GraphContext } from '../GraphContext';
import { updateSelection, setSelection } from '../state/actions';

const initialRect = {
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  draw: false,
  fixed: false
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
  const { dispatch, state } = useContext(GraphContext);

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
        const mousePos = getMousePosition(evt);

        const negativeX = mousePos.x < r.startX;
        const negativeY = mousePos.y < r.startY;

        if (!r.draw) {
          return r;
        }

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

        dispatch(updateSelection(nextRect));

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

  const selectionRect = rect.fixed ? state.selectedNodesBbox : rect;
  console.log(selectionRect)

  return (
    <div
      className="react-graph__selectionpane"
      ref={selectionPane}
    >
      {(rect.draw || rect.fixed) && (
        <div
          className="react-graph__selection"
          style={{
            width: selectionRect.width,
            height: selectionRect.height,
            transform: `translate(${selectionRect.x}px, ${selectionRect.y}px)`
          }}
        />
      )}
    </div>
  );
}
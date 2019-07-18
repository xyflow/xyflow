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

export default () => {
  const selectionPane = useRef(null);
  const [rect, setRect] = useState(initialRect);
  const { dispatch, state } = useContext(GraphContext);

  useEffect(() => {
    function onMouseDown(evt) {
      setRect((r) => ({
        ...r,
        startX: evt.clientX,
        startY: evt.clientY,
        x: evt.clientX,
        y: evt.clientY,
        draw: true
      }));

      dispatch(setSelection(true));
    }

    function onMouseMove(evt) {
      setRect((r) => {
        const negativeX = evt.clientX < r.startX;
        const negativeY = evt.clientY < r.startY;

        if (!r.draw) {
          return r;
        }

        const nextRect = {
          ...r,
          x: negativeX ? evt.clientX : r.x,
          y: negativeY ? evt.clientY : r.y,
          width: negativeX ? r.startX - evt.clientX : evt.clientX - r.startX,
          height: negativeY ? r.startY - evt.clientY : evt.clientY - r.startY,
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
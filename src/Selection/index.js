import React, { useEffect, useRef, useState } from 'react';

export default () => {
  const selectionPane = useRef(null);
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0, draw: false });


  useEffect(() => {
    function onMouseDown(evt) {
      setRect((r) => ({
        ...r,
        x: evt.clientX,
        y: evt.clientY,
        draw: true
      }));
    }

    function onMouseMove(evt) {
      setRect((r) => ({
        ...r,
        width: evt.clientX,
        height: evt.clientY
      }));
    }

    function onMouseUp() {
      console.log('selection mouse up');
    }

    function removeAll() {
      selectionPane.current.removeEventListener('mousedown', onMouseDown);
      selectionPane.current.removeEventListener('mousemove', onMouseMove);
      selectionPane.current.removeEventListener('mouseup', onMouseUp);
    }

    selectionPane.current.addEventListener('mousedown', onMouseDown);
    selectionPane.current.addEventListener('mousemove', onMouseMove);
    selectionPane.current.addEventListener('mouseup', onMouseUp);

    return () => {
      removeAll();
    };
  }, []);

  return (
    <div
      className="react-graph__selectionpane"
      ref={selectionPane}
    >
      {rect.draw && (
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
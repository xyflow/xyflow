import React, { useEffect, useRef } from 'react';
import { drag, D3DragEvent, SubjectPosition } from 'd3-drag';
import { select } from 'd3-selection';
import { useReactFlow } from 'react-flow-renderer';

function MiniMapDrag({ x = 0, y = 0, width = 0, height = 0 }) {
  const dragRef = useRef<SVGRectElement>(null);
  const { getViewport, setViewport } = useReactFlow();

  useEffect(() => {
    if (dragRef.current) {
      const onDrag = (
        evt: D3DragEvent<SVGRectElement, null, SubjectPosition>
      ) => {
        const { x, y, zoom } = getViewport();
        setViewport({ x: x - evt.dx * zoom, y: y - evt.dy * zoom, zoom });
      };

      const selection = select(dragRef.current as Element);
      const dragBehaviour = drag().on('drag', onDrag);

      selection.call(dragBehaviour);

      return () => {
        selection.on('.drag', null);
      };
    }
  }, [getViewport, setViewport]);

  return (
    <rect
      ref={dragRef}
      fill='rgba(255, 0,0,.5)'
      x={x}
      y={y}
      width={width}
      height={height}
    />
  );
}

export default MiniMapDrag;

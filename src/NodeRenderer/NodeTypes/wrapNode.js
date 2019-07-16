import React, { useEffect, useRef, useContext } from 'react';
import ReactDraggable from 'react-draggable';

import { GraphContext } from '../../GraphContext';
import { updateNodeData, updateNodePos } from '../../state/actions';

export default NodeComponent => (props) => {
  const { position, data, onNodeClick } = props;
  const { id, __width, __height } = data;
  const nodeElement = useRef(null);
  const graphContext = useContext(GraphContext);
  const [ x, y, k ] = graphContext.state.transform;

  useEffect(() => {
    const bounds = nodeElement.current.getBoundingClientRect();
    const unscaledWith = Math.round(bounds.width * (1 / k));
    const unscaledHeight = Math.round(bounds.height * (1 / k));

    if (__width !== unscaledWith || __height !== unscaledHeight) {
      graphContext.dispatch(updateNodeData(id, { __width: unscaledWith, __height: unscaledHeight }));
    }
  }, []);

  const nodePosition = {
    x: (k * position.x) + x,
    y: (k * position.y) + y
  };

  return (
    <ReactDraggable.DraggableCore
      grid={[1, 1]}
      onStart={(e) => {
        const offsetX = e.clientX - position.x - x;
        const offsetY = e.clientY - position.y - y;

        graphContext.dispatch(updateNodeData(id, { __offsetX: offsetX, __offsetY: offsetY }));
      }}
      onDrag={(e, d) => {
        const { __offsetX = 0, __offsetY = 0 } = data;

        graphContext.dispatch(updateNodePos(id, {
          x: e.clientX - x - __offsetX,
          y: e.clientY - y - __offsetY
        }));
      }}
      scale={k}
    >
      <div
        className="react-graph__nodewrap"
        ref={nodeElement}
        style={{ transform: `translate(${position.x}px,${position.y}px)` }}
        onClick={() => onNodeClick({ data, position })}
      >
        <NodeComponent {...props} />
      </div>
    </ReactDraggable.DraggableCore>
  );
};

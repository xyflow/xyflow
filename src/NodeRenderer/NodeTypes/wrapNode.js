import React, { useEffect, useRef, useContext } from 'react';
import ReactDraggable from 'react-draggable';

import { GraphContext } from '../../GraphContext';
import { updateNodeData, updateNodePos } from '../../state/actions';
import { projectPosition } from '../../graph-utils';

export default NodeComponent => (props) => {
  const { position, data, onNodeClick } = props;
  const { id } = data;
  const nodeElement = useRef(null);
  const graphContext = useContext(GraphContext);
  const [ x, y, k ] = graphContext.state.transform;

  useEffect(() => {
    const bounds = nodeElement.current.getBoundingClientRect();
    const unscaledWith = Math.round(bounds.width * (1 / k));
    const unscaledHeight = Math.round(bounds.height * (1 / k));

    graphContext.dispatch(updateNodeData(id, { __width: unscaledWith, __height: unscaledHeight }));
  }, []);

  return (
    <ReactDraggable.DraggableCore
      grid={[1, 1]}
      onStart={(e) => {
        const unscaledPos = {
          x: e.clientX * (1 / k),
          y: e.clientY * (1 / k)
        }
        const offsetX = unscaledPos.x - position.x - x;
        const offsetY = unscaledPos.y - position.y - y;

        graphContext.dispatch(updateNodeData(id, { __offsetX: offsetX, __offsetY: offsetY }));
      }}
      onDrag={(e, d) => {
        const { __offsetX = 0, __offsetY = 0 } = data;
        const unscaledPos = {
          x: e.clientX * (1 / k),
          y: e.clientY * (1 / k)
        }

        graphContext.dispatch(updateNodePos(id, {
          x: unscaledPos.x - x - __offsetX,
          y: unscaledPos.y - y - __offsetY
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

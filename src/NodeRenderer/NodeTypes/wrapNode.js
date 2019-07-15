import React, { useEffect, useRef, useContext } from 'react';
import styled from '@emotion/styled';
import ReactDraggable from 'react-draggable';

import { GraphContext } from '../../GraphContext';

const NodeWrapper = styled.div`
  position: absolute;
  width: 150px;
  color: #222;
  font-family: sans-serif;
  font-size: 12px;
  text-align: center;
  cursor: grab;
  border: 1px solid #ddd;
  border-radius: 2px;
  user-select: none;
  pointer-events: all;
  transform-origin: 0 0;

  &:hover {
    box-shadow: 0 1px 5px 2px rgba(0, 0, 0, 0.08);
  }
`;

export default NodeComponent => (props) => {
  const { position, data, onNodeClick } = props;
  const { id, __width, __height } = data;
  const nodeElement = useRef(null);
  const graphContext = useContext(GraphContext);
  const { x, y, k } = graphContext.transform;

  useEffect(() => {
    const bounds = nodeElement.current.getBoundingClientRect();

    if (__width !== bounds.width || __height !== bounds.height) {
      graphContext.updateNodeData(id, { __width: bounds.width, __height: bounds.height });
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

        graphContext.updateNodeData(id, { __offsetX: offsetX, __offsetY: offsetY });
      }}
      onDrag={(e, d) => {
        const { __offsetX = 0, __offsetY = 0 } = data;

        graphContext.updateNodePos(id, {
          x: e.clientX - x - __offsetX,
          y: e.clientY - y - __offsetY
        });
      }}
      scale={k}
    >
      <NodeWrapper
        className="node"
        ref={nodeElement}
        style={{ transform: `translate(${position.x}px,${position.y}px)` }}
        onClick={() => onNodeClick(data)}
        // style={{ transform: `translate(${nodePosition.x}px,${nodePosition.y}px) scale(${k})` }}
      >
        <NodeComponent {...props} />
      </NodeWrapper>
    </ReactDraggable.DraggableCore>
  );
};

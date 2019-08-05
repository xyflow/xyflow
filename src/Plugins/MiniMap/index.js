import React, { useRef, useContext, useEffect } from 'react';
import classnames from 'classnames';

import { getNodesInside } from '../../graph-utils';
import { GraphContext } from '../../GraphContext';

const baseStyle = {
  position: 'absolute',
  zIndex: 5,
  bottom: 10,
  right: 10,
  width: 200,
};

export default ({ style, className, bgColor = '#f8f8f8', nodeColor = '#ddd' }) => {
  const canvasNode = useRef(null);
  const { state } = useContext(GraphContext);
  const mapClasses = classnames('react-graph__minimap', className);
  const nodePositions = state.nodes.map(n => n.__rg.position);
  const width = style.width || baseStyle.width;
  const height = (state.height / (state.width || 1)) * width;
  const bbox = { x: 0, y: 0, width: state.width, height: state.height };
  const scaleFactor = width / state.width;

  useEffect(() => {
    if (canvasNode) {
      const ctx = canvasNode.current.getContext('2d');
      const nodesInside = getNodesInside(state.nodes, bbox, state.transform);

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      nodesInside.forEach((n) => {
        const pos = n.__rg.position;
        const transformX = state.transform[0];
        const transformY = state.transform[1];
        const x = (pos.x * state.transform[2]) + transformX;
        const y = (pos.y * state.transform[2]) + transformY;

        ctx.fillStyle = nodeColor;
        ctx.fillRect(
          (x * scaleFactor),
          (y * scaleFactor),
          n.__rg.width * scaleFactor,
          n.__rg.height * scaleFactor)
        ;
      });
    }
  }, [nodePositions, state.transform, height])

  return (
    <canvas
      style={{
        ...baseStyle,
        ...style,
        height
      }}
      width={width}
      height={height}
      className={mapClasses}
      ref={canvasNode}
    />
  );
}

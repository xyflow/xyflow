import React, { CSSProperties } from 'react';
import classnames from 'classnames';

import { useStoreState } from '../../store/hooks';
import { getRectOfNodes, getBoundsofRects } from '../../utils/graph';
import { Node, Rect } from '../../types';
import MiniMapNode from './MiniMapNode';

type StringFunc = (node: Node) => string;

interface MiniMapProps extends React.HTMLAttributes<SVGSVGElement> {
  nodeColor?: string | StringFunc;
  nodeBorderRadius?: number;
  maskColor?: string;
}

const baseStyle: CSSProperties = {
  position: 'absolute',
  zIndex: 5,
  bottom: 10,
  right: 10,
  width: 200,
  height: 150,
};

const MiniMap = ({
  style = { backgroundColor: '#f8f8f8' },
  className,
  nodeColor = '#ddd',
  nodeBorderRadius = 5,
  maskColor = 'rgba(10, 10, 10, .25)',
}: MiniMapProps) => {
  const state = useStoreState(({ width, height, nodes, transform: [tX, tY, tScale] }) => ({
    width,
    height,
    nodes,
    tX,
    tY,
    tScale,
  }));

  const mapClasses = classnames('react-flow__minimap', className);
  const elementWidth = (style.width || baseStyle.width)! as number;
  const elementHeight = (style.height || baseStyle.height)! as number;
  const nodeColorFunc = (nodeColor instanceof Function ? nodeColor : () => nodeColor) as StringFunc;
  const hasNodes = state.nodes && state.nodes.length;

  const bb = getRectOfNodes(state.nodes);
  const viewBB: Rect = {
    x: -state.tX / state.tScale,
    y: -state.tY / state.tScale,
    width: state.width / state.tScale,
    height: state.height / state.tScale,
  };

  const boundingRect = hasNodes ? getBoundsofRects(bb, viewBB) : viewBB;

  const scaledWidth = boundingRect.width / elementWidth;
  const scaledHeight = boundingRect.height / elementHeight;
  const viewScale = Math.max(scaledWidth, scaledHeight);
  const viewWidth = viewScale * elementWidth;
  const viewHeight = viewScale * elementHeight;

  const offset = 5 * viewScale;

  const x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
  const y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
  const width = viewWidth + offset * 2;
  const height = viewHeight + offset * 2;

  return (
    <svg
      width={elementWidth}
      height={elementHeight}
      viewBox={`${x} ${y} ${width} ${height}`}
      style={{
        ...baseStyle,
        ...style,
      }}
      className={mapClasses}
    >
      {state.nodes.map((node) => (
        <MiniMapNode key={node.id} node={node} color={nodeColorFunc(node)} borderRadius={nodeBorderRadius} />
      ))}
      <path
        className="react-flow__minimap-mask"
        d={`M${x - offset},${y - offset}h${width + offset * 2}v${height + offset * 2}h${-width - offset * 2}z
        M${viewBB.x},${viewBB.y}h${viewBB.width}v${viewBB.height}h${-viewBB.width}z`}
        fill={maskColor}
        fillRule="evenodd"
      />
    </svg>
  );
};

MiniMap.displayName = 'MiniMap';

export default MiniMap;

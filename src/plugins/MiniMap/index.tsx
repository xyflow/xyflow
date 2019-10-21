import React, { CSSProperties } from 'react';
import classnames from 'classnames';

import { useStoreState } from '../../store/hooks';
import { getBoundingBox } from '../../utils/graph';
import { Node } from '../../types';

type StringFunc = (node: Node) => string;

interface MiniMapProps extends React.HTMLAttributes<SVGSVGElement> {
  nodeColor: string | StringFunc;
}
interface MiniMapNodeProps {
  node: Node;
  color: string;
}

const baseStyle: CSSProperties = {
  position: 'absolute',
  zIndex: 5,
  bottom: 10,
  right: 10,
  width: 200,
  height: 150,
};

const MiniMapNode = ({ node, color }: MiniMapNodeProps) => {
  const {
    position: { x, y },
    width,
    height,
  } = node.__rg;
  const { background, backgroundColor } = node.style || {};
  const fill = (background || backgroundColor || color) as string;
  return <rect x={x} y={y} rx={5} ry={5} width={width} height={height} fill={fill} />;
};

export default ({ style = { backgroundColor: '#f8f8f8' }, className, nodeColor = '#ddd' }: MiniMapProps) => {
  const {
    width,
    height,
    nodes,
    transform: [viewX, viewY, scale],
  } = useStoreState(s => s);

  const mapClasses = classnames('react-flow__minimap', className);
  const elementWidth = (style.width || baseStyle.width)!;
  const elementHeight = (style.height || baseStyle.height)!;
  const nodeColorFunc = (nodeColor instanceof Function ? nodeColor : () => nodeColor) as StringFunc;

  const bb = getBoundingBox(nodes);
  return (
    <svg
      width={elementWidth}
      height={elementHeight}
      viewBox={`${bb.x} ${bb.y} ${bb.width} ${bb.height}`}
      style={{
        ...baseStyle,
        ...style,
      }}
      className={mapClasses}
    >
      {nodes.map(node => (
        <MiniMapNode key={node.id} node={node} color={nodeColorFunc(node)} />
      ))}
      <mask id="mapClip">
        <rect x="-100%" y="-100%" width="200%" height="200%" fill="white" />
        <rect x={-viewX / scale} y={-viewY / scale} width={width / scale} height={height / scale} fill="black" />
      </mask>
      <rect x="-100%" y="-100%" width="200%" height="200%" fill="rgba(0,0,0,.2)" mask="url(#mapClip)" />
    </svg>
  );
};

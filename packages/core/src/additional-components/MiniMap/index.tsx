import React, { memo } from 'react';
import cc from 'classcat';
import shallow from 'zustand/shallow';

import MiniMapNode from './MiniMapNode';
import { useStore } from '../../store';
import { getRectOfNodes } from '../../utils/graph';
import { getBoundsofRects } from '../../utils';

import { MiniMapProps, GetMiniMapNodeAttribute, ReactFlowState } from '../../types';

declare const window: any;

const defaultWidth = 200;
const defaultHeight = 150;

const selector = (s: ReactFlowState) => ({
  viewBBox: {
    x: -s.transform[0] / s.transform[2],
    y: -s.transform[1] / s.transform[2],
    width: s.width / s.transform[2],
    height: s.height / s.transform[2],
  },
  nodes: Array.from(s.nodeInternals.values()),
});

const getAttrFunction = (func: any): GetMiniMapNodeAttribute => (func instanceof Function ? func : () => func);

const MiniMap = ({
  style,
  className,
  nodeStrokeColor = '#555',
  nodeColor = '#fff',
  nodeClassName = '',
  nodeBorderRadius = 5,
  nodeStrokeWidth = 2,
  maskColor = 'rgb(240, 242, 243, 0.7)',
}: MiniMapProps) => {
  const { viewBBox, nodes } = useStore(selector, shallow);
  const elementWidth = (style?.width as number) ?? defaultWidth;
  const elementHeight = (style?.height as number) ?? defaultHeight;
  const nodeColorFunc = getAttrFunction(nodeColor);
  const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
  const nodeClassNameFunc = getAttrFunction(nodeClassName);
  const boundingRect = nodes.length > 0 ? getBoundsofRects(getRectOfNodes(nodes), viewBBox) : viewBBox;
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
  const shapeRendering = typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';

  return (
    <svg
      width={elementWidth}
      height={elementHeight}
      viewBox={`${x} ${y} ${width} ${height}`}
      style={style}
      className={cc(['react-flow__minimap', className])}
    >
      {nodes
        .filter((node) => !node.hidden && node.width && node.height)
        .map((node) => {
          return (
            <MiniMapNode
              key={node.id}
              x={node.positionAbsolute?.x ?? 0}
              y={node.positionAbsolute?.y ?? 0}
              width={node.width!}
              height={node.height!}
              style={node.style}
              className={nodeClassNameFunc(node)}
              color={nodeColorFunc(node)}
              borderRadius={nodeBorderRadius}
              strokeColor={nodeStrokeColorFunc(node)}
              strokeWidth={nodeStrokeWidth}
              shapeRendering={shapeRendering}
            />
          );
        })}
      <path
        className="react-flow__minimap-mask"
        d={`M${x - offset},${y - offset}h${width + offset * 2}v${height + offset * 2}h${-width - offset * 2}z
        M${viewBBox.x},${viewBBox.y}h${viewBBox.width}v${viewBBox.height}h${-viewBBox.width}z`}
        fill={maskColor}
        fillRule="evenodd"
      />
    </svg>
  );
};

MiniMap.displayName = 'MiniMap';

export default memo(MiniMap);

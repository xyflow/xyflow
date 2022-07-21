import React, { memo } from 'react';
import cc from 'classcat';
import shallow from 'zustand/shallow';
import {
  useStore,
  getRectOfNodes,
  Box,
  MiniMapProps,
  GetMiniMapNodeAttribute,
  ReactFlowState,
  Rect,
} from '@react-flow/core';

import MiniMapNode from './MiniMapNode';
import MiniMapDrag from './MiniMapDrag';

declare const window: any;

const defaultWidth = 200;
const defaultHeight = 150;

const selector = (s: ReactFlowState) => ({
  width: s.width,
  height: s.height,
  transform: s.transform,
  nodes: Array.from(s.nodeInternals.values()),
});

const getAttrFunction = (func: any): GetMiniMapNodeAttribute =>
  func instanceof Function ? func : () => func;

export const getBoundsOfBoxes = (box1: Box, box2: Box): Box => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2),
});

export const rectToBox = ({ x, y, width, height }: Rect): Box => ({
  x,
  y,
  x2: x + width,
  y2: y + height,
});

export const boxToRect = ({ x, y, x2, y2 }: Box): Rect => ({
  x,
  y,
  width: x2 - x,
  height: y2 - y,
});

export const getBoundsofRects = (rect1: Rect, rect2: Rect): Rect =>
  boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));

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
  const {
    width: containerWidth,
    height: containerHeight,
    transform,
    nodes,
  } = useStore(selector, shallow);
  const elementWidth = (style?.width as number) ?? defaultWidth;
  const elementHeight = (style?.height as number) ?? defaultHeight;
  const nodeColorFunc = getAttrFunction(nodeColor);
  const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
  const nodeClassNameFunc = getAttrFunction(nodeClassName);
  const viewBB: Rect = {
    x: -transform[0] / transform[2],
    y: -transform[1] / transform[2],
    width: containerWidth / transform[2],
    height: containerHeight / transform[2],
  };
  const boundingRect =
    nodes.length > 0 ? getBoundsofRects(getRectOfNodes(nodes), viewBB) : viewBB;
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
  const shapeRendering =
    typeof window === 'undefined' || !!window.chrome
      ? 'crispEdges'
      : 'geometricPrecision';

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
      <MiniMapDrag
        x={viewBB.x}
        y={viewBB.y}
        width={viewBB.width}
        height={viewBB.height}
      />
      <path
        className='react-flow__minimap-mask'
        d={`M${x - offset},${y - offset}h${width + offset * 2}v${
          height + offset * 2
        }h${-width - offset * 2}z
        M${viewBB.x},${viewBB.y}h${viewBB.width}v${
          viewBB.height
        }h${-viewBB.width}z`}
        fill={maskColor}
        fillRule='evenodd'
      />
    </svg>
  );
};

MiniMap.displayName = 'MiniMap';

export default memo(MiniMap);

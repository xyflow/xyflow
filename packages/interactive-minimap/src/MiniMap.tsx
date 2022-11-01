/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useRef, MouseEvent } from 'react';
import cc from 'classcat';
import shallow from 'zustand/shallow';
import { zoom, D3ZoomEvent, zoomIdentity } from 'd3-zoom';
import { select, pointer } from 'd3-selection';

import { useStore, getRectOfNodes, Panel, getBoundsOfRects, useStoreApi, ReactFlowState, Rect } from '@reactflow/core';

import MiniMapNode from './MiniMapNode';
import { MiniMapProps, GetMiniMapNodeAttribute } from './types';

declare const window: any;

const defaultWidth = 200;
const defaultHeight = 150;

const selector = (s: ReactFlowState) => {
  const nodes = Array.from(s.nodeInternals.values());
  const viewBB: Rect = {
    x: -s.transform[0] / s.transform[2],
    y: -s.transform[1] / s.transform[2],
    width: s.width / s.transform[2],
    height: s.height / s.transform[2],
  };

  return {
    nodes: nodes.filter((node) => !node.hidden && node.width && node.height),
    viewBB,
    boundingRect: nodes.length > 0 ? getBoundsOfRects(getRectOfNodes(nodes), viewBB) : viewBB,
    rfId: s.rfId,
  };
};

const getAttrFunction = (func: any): GetMiniMapNodeAttribute => (func instanceof Function ? func : () => func);

const ARIA_LABEL_KEY = 'react-flow__minimap-desc';

function MiniMap({
  style,
  className,
  nodeStrokeColor = '#555',
  nodeColor = '#999',
  nodeClassName = '',
  nodeBorderRadius = 5,
  nodeStrokeWidth = 2,
  maskColor = 'rgb(200, 200, 200, 0.9)',
  position = 'bottom-right',
  onClick,
}: MiniMapProps) {
  const store = useStoreApi();
  const svg = useRef<SVGSVGElement>(null);
  const { boundingRect, viewBB, nodes, rfId } = useStore(selector, shallow);
  const elementWidth = (style?.width as number) ?? defaultWidth;
  const elementHeight = (style?.height as number) ?? defaultHeight;
  const nodeColorFunc = getAttrFunction(nodeColor);
  const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
  const nodeClassNameFunc = getAttrFunction(nodeClassName);
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
  const labelledBy = `${ARIA_LABEL_KEY}-${rfId}`;
  const viewScaleRef = useRef(0);

  viewScaleRef.current = viewScale;

  const onSvgClick = (event: MouseEvent) => {
    const rfCoord = pointer(event);
    onClick?.(event, { x: rfCoord[0], y: rfCoord[1] });
  };

  useEffect(() => {
    if (svg.current) {
      const selection = select(svg.current as Element);

      const zoomHandler = zoom()
        .on('zoom.wheel', (event: D3ZoomEvent<HTMLDivElement, any>) => {
          const { transform, d3Selection, d3Zoom } = store.getState();

          if (event.sourceEvent.type !== 'wheel' || !d3Selection || !d3Zoom) {
            return;
          }

          const pinchDelta =
            -event.sourceEvent.deltaY *
            (event.sourceEvent.deltaMode === 1 ? 0.05 : event.sourceEvent.deltaMode ? 1 : 0.002) *
            10;
          const zoom = transform[2] * Math.pow(2, pinchDelta);

          d3Zoom.scaleTo(d3Selection, zoom);
        })
        .on('zoom', (event: D3ZoomEvent<HTMLDivElement, any>) => {
          const { transform, d3Selection, d3Zoom } = store.getState();

          if (event.sourceEvent.type !== 'mousemove' || !d3Selection || !d3Zoom) {
            return;
          }

          const position = {
            x: transform[0] - event.sourceEvent.movementX * viewScaleRef.current * transform[2],
            y: transform[1] - event.sourceEvent.movementY * viewScaleRef.current * transform[2],
          };

          const nextTransform = zoomIdentity.translate(position.x, position.y).scale(transform[2]);

          d3Zoom.transform(d3Selection, nextTransform);
        });
      selection.call(zoomHandler);
    }
  }, []);

  return (
    <Panel position={position} style={style} className={cc(['react-flow__minimap', className])}>
      <svg
        width={elementWidth}
        height={elementHeight}
        viewBox={`${x} ${y} ${width} ${height}`}
        role="img"
        aria-labelledby={labelledBy}
        ref={svg}
        onClick={onSvgClick}
      >
        <title id={labelledBy}>React Flow mini map</title>
        {nodes.map((node) => {
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
        M${viewBB.x},${viewBB.y}h${viewBB.width}v${viewBB.height}h${-viewBB.width}z`}
          fill={maskColor}
          fillRule="evenodd"
        />
      </svg>
    </Panel>
  );
}

MiniMap.displayName = 'MiniMap';

export default memo(MiniMap);

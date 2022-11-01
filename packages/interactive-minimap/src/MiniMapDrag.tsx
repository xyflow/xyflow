/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useRef } from 'react';
import cc from 'classcat';
import shallow from 'zustand/shallow';
import { zoom, D3ZoomEvent, zoomIdentity } from 'd3-zoom';
import { select } from 'd3-selection';
import {
  useStore,
  getRectOfNodes,
  ReactFlowState,
  Rect,
  Panel,
  getBoundsOfRects,
  useStoreApi,
  useReactFlow,
  XYPosition,
} from '@reactflow/core';

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
  nodeColor = '#fff',
  nodeClassName = '',
  nodeBorderRadius = 5,
  nodeStrokeWidth = 2,
  maskColor = 'rgb(240, 242, 243, 0.7)',
  position = 'bottom-right',
}: MiniMapProps) {
  const store = useStoreApi();
  const svg = useRef<SVGSVGElement>(null);
  const initialized = useRef(false);
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
  const { setCenter } = useReactFlow();
  const startTransform = useRef<XYPosition>({ x: 0, y: 0 });
  const viewScaleRef = useRef(0);
  const viewScaleWRef = useRef(0);
  const viewScaleHRef = useRef(0);

  viewScaleRef.current = viewScale;
  viewScaleWRef.current = scaledWidth;
  viewScaleHRef.current = scaledHeight;

  useEffect(() => {
    if (!initialized.current && svg.current) {
      const bounds = svg.current.getBoundingClientRect() || { left: 0, top: 0 };

      const selection = select(svg.current as Element);

      const zoomHandler = zoom()
        .on('start', (event: D3ZoomEvent<HTMLDivElement, any>) => {
          const { transform } = store.getState();

          const px = (event.sourceEvent.clientX - bounds.left) * viewScaleRef.current;
          const py = (event.sourceEvent.clientY - bounds.top) * viewScaleRef.current;

          startTransform.current = {
            x: px - transform[0] / transform[2],
            y: py - transform[1] / transform[2],
          };
        })
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
          d3Zoom.scaleTo(d3Selection, zoom, [startTransform.current.x, startTransform.current.y]);
        })
        .on('zoom', (event: D3ZoomEvent<HTMLDivElement, any>) => {
          if (event.sourceEvent.type !== 'mousemove') {
            return;
          }

          const { transform, d3Selection, d3Zoom } = store.getState();
          const px = (event.sourceEvent.clientX - bounds.left) * viewScaleRef.current;
          const py = (event.sourceEvent.clientY - bounds.top) * viewScaleRef.current;

          const position = {
            x: (px - startTransform.current.x) * transform[2],
            y: (py - startTransform.current.y) * transform[2],
          };

          const nextTransform = zoomIdentity.translate(position.x, position.y).scale(transform[2]);
          d3Zoom!.transform(d3Selection!, nextTransform);
        });
      selection.call(zoomHandler);
      initialized.current = true;
    }
  }, [setCenter]);

  return (
    <Panel position={position} style={style} className={cc(['react-flow__minimap', className])}>
      <svg
        width={elementWidth}
        height={elementHeight}
        viewBox={`${x} ${y} ${width} ${height}`}
        role="img"
        aria-labelledby={labelledBy}
        ref={svg}
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

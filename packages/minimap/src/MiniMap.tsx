/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import { zoom, zoomIdentity } from 'd3-zoom';
import type { D3ZoomEvent } from 'd3-zoom';
import { select, pointer } from 'd3-selection';
import { useStore, getRectOfNodes, Panel, getBoundsOfRects, useStoreApi, CoordinateExtent } from '@reactflow/core';
import type { ReactFlowState, Rect } from '@reactflow/core';

import type { MiniMapProps } from './types';
import MiniMapNodes from './MiniMapNodes';

const defaultWidth = 200;
const defaultHeight = 150;

const selector = (s: ReactFlowState) => {
  const nodes = s.getNodes();
  const viewBB: Rect = {
    x: -s.transform[0] / s.transform[2],
    y: -s.transform[1] / s.transform[2],
    width: s.width / s.transform[2],
    height: s.height / s.transform[2],
  };

  return {
    viewBB,
    boundingRect: nodes.length > 0 ? getBoundsOfRects(getRectOfNodes(nodes, s.nodeOrigin), viewBB) : viewBB,
    rfId: s.rfId,
  };
};

const ARIA_LABEL_KEY = 'react-flow__minimap-desc';
function MiniMap({
  style,
  className,
  nodeStrokeColor = 'transparent',
  nodeColor = '#e2e2e2',
  nodeClassName = '',
  nodeBorderRadius = 5,
  nodeStrokeWidth = 2,
  // We need to rename the prop to be `CapitalCase` so that JSX will render it as
  // a component properly.
  nodeComponent,
  maskColor = 'rgb(240, 240, 240, 0.6)',
  maskStrokeColor = 'none',
  maskStrokeWidth = 1,
  position = 'bottom-right',
  onClick,
  onNodeClick,
  pannable = false,
  zoomable = false,
  ariaLabel = 'React Flow mini map',
  inversePan = false,
  zoomStep = 10,
  offsetScale = 5
}: MiniMapProps) {
  const store = useStoreApi();
  const svg = useRef<SVGSVGElement>(null);
  const { boundingRect, viewBB, rfId } = useStore(selector, shallow);
  const elementWidth = (style?.width as number) ?? defaultWidth;
  const elementHeight = (style?.height as number) ?? defaultHeight;

  const scaledWidth = boundingRect.width / elementWidth;
  const scaledHeight = boundingRect.height / elementHeight;
  const viewScale = Math.max(scaledWidth, scaledHeight);
  const viewWidth = viewScale * elementWidth;
  const viewHeight = viewScale * elementHeight;
  const offset = offsetScale * viewScale;
  const x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
  const y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
  const width = viewWidth + offset * 2;
  const height = viewHeight + offset * 2;
  const labelledBy = `${ARIA_LABEL_KEY}-${rfId}`;
  const viewScaleRef = useRef(0);

  viewScaleRef.current = viewScale;

  useEffect(() => {
    if (svg.current) {
      const selection = select(svg.current as Element);

      const zoomHandler = (event: D3ZoomEvent<SVGSVGElement, any>) => {
        const { transform, d3Selection, d3Zoom } = store.getState();

        if (event.sourceEvent.type !== 'wheel' || !d3Selection || !d3Zoom) {
          return;
        }

        const pinchDelta =
          -event.sourceEvent.deltaY *
          (event.sourceEvent.deltaMode === 1 ? 0.05 : event.sourceEvent.deltaMode ? 1 : 0.002) *
          zoomStep;
        const zoom = transform[2] * Math.pow(2, pinchDelta);

        d3Zoom.scaleTo(d3Selection, zoom);
      };

      const panHandler = (event: D3ZoomEvent<HTMLDivElement, any>) => {
        const { transform, d3Selection, d3Zoom, translateExtent, width, height } = store.getState();

        if (event.sourceEvent.type !== 'mousemove' || !d3Selection || !d3Zoom) {
          return;
        }

        // @TODO: how to calculate the correct next position? Math.max(1, transform[2]) is a workaround.
        const moveScale = viewScaleRef.current * Math.max(1, transform[2]) * (inversePan ? -1 : 1);
        const position = {
          x: transform[0] - event.sourceEvent.movementX * moveScale,
          y: transform[1] - event.sourceEvent.movementY * moveScale,
        };
        const extent: CoordinateExtent = [
          [0, 0],
          [width, height],
        ];

        const nextTransform = zoomIdentity.translate(position.x, position.y).scale(transform[2]);
        const constrainedTransform = d3Zoom.constrain()(nextTransform, extent, translateExtent);

        d3Zoom.transform(d3Selection, constrainedTransform);
      };

      const zoomAndPanHandler = zoom()
        // @ts-ignore
        .on('zoom', pannable ? panHandler : null)
        // @ts-ignore
        .on('zoom.wheel', zoomable ? zoomHandler : null);

      selection.call(zoomAndPanHandler);

      return () => {
        selection.on('zoom', null);
      };
    }
  }, [pannable, zoomable, inversePan, zoomStep]);

  const onSvgClick = onClick
    ? (event: MouseEvent) => {
        const rfCoord = pointer(event);
        onClick(event, { x: rfCoord[0], y: rfCoord[1] });
      }
    : undefined;

  const onSvgNodeClick = onNodeClick
    ? (event: MouseEvent, nodeId: string) => {
        const node = store.getState().nodeInternals.get(nodeId)!;
        onNodeClick(event, node);
      }
    : undefined;

  return (
    <Panel
      position={position}
      style={style}
      className={cc(['react-flow__minimap', className])}
      data-testid="rf__minimap"
    >
      <svg
        width={elementWidth}
        height={elementHeight}
        viewBox={`${x} ${y} ${width} ${height}`}
        role="img"
        aria-labelledby={labelledBy}
        ref={svg}
        onClick={onSvgClick}
      >
        {ariaLabel && <title id={labelledBy}>{ariaLabel}</title>}
        <MiniMapNodes
          onClick={onSvgNodeClick}
          nodeColor={nodeColor}
          nodeStrokeColor={nodeStrokeColor}
          nodeBorderRadius={nodeBorderRadius}
          nodeClassName={nodeClassName}
          nodeStrokeWidth={nodeStrokeWidth}
          nodeComponent={nodeComponent}
        />
        <path
          className="react-flow__minimap-mask"
          d={`M${x - offset},${y - offset}h${width + offset * 2}v${height + offset * 2}h${-width - offset * 2}z
        M${viewBB.x},${viewBB.y}h${viewBB.width}v${viewBB.height}h${-viewBB.width}z`}
          fill={maskColor}
          fillRule="evenodd"
          stroke={maskStrokeColor}
          strokeWidth={maskStrokeWidth}
          pointerEvents="none"
        />
      </svg>
    </Panel>
  );
}

MiniMap.displayName = 'MiniMap';

export default memo(MiniMap);

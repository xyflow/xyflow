/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useRef, type MouseEvent } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import {
  getRectOfNodes,
  getBoundsOfRects,
  getNodePositionWithOrigin,
  XYMinimap,
  type Rect,
  type XYMinimapInstance,
} from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import Panel from '../../components/Panel';
import type { ReactFlowState } from '../../types';

import MiniMapNode from './MiniMapNode';
import type { MiniMapProps, GetMiniMapNodeAttribute } from './types';

declare const window: any;

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
    nodes: nodes.filter((node) => !node.hidden && node.width && node.height),
    viewBB,
    boundingRect: nodes.length > 0 ? getBoundsOfRects(getRectOfNodes(nodes, s.nodeOrigin), viewBB) : viewBB,
    rfId: s.rfId,
    nodeOrigin: s.nodeOrigin,
    panZoom: s.panZoom,
    translateExtent: s.translateExtent,
    flowWidth: s.width,
    flowHeight: s.height,
  };
};

const getAttrFunction = (func: any): GetMiniMapNodeAttribute => (func instanceof Function ? func : () => func);

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
  nodeComponent: NodeComponent = MiniMapNode,
  maskColor = 'rgb(240, 240, 240, 0.6)',
  maskStrokeColor = 'none',
  maskStrokeWidth = 1,
  position = 'bottom-right',
  onClick,
  onNodeClick,
  pannable = false,
  zoomable = false,
  ariaLabel = 'React Flow mini map',
  inversePan,
  zoomStep,
}: MiniMapProps) {
  const store = useStoreApi();
  const svg = useRef<SVGSVGElement>(null);
  const { boundingRect, viewBB, nodes, rfId, nodeOrigin, panZoom, translateExtent, flowWidth, flowHeight } = useStore(
    selector,
    shallow
  );
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
  const minimapInstance = useRef<XYMinimapInstance>();

  viewScaleRef.current = viewScale;

  useEffect(() => {
    if (svg.current && panZoom) {
      minimapInstance.current = XYMinimap({
        domNode: svg.current,
        panZoom,
        getTransform: () => store.getState().transform,
        getViewScale: () => viewScaleRef.current,
      });

      return () => {
        minimapInstance.current?.destroy();
      };
    }
  }, [panZoom]);

  useEffect(() => {
    minimapInstance.current?.update({
      translateExtent,
      width: flowWidth,
      height: flowHeight,
      inversePan,
      pannable,
      zoomStep,
      zoomable,
    });
  }, [pannable, zoomable, inversePan, zoomStep, translateExtent, flowWidth, flowHeight]);

  const onSvgClick = onClick
    ? (event: MouseEvent) => {
        const [x, y] = minimapInstance.current?.pointer(event) || [0, 0];
        onClick(event, { x, y });
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
        {nodes.map((node) => {
          const { x, y } = getNodePositionWithOrigin(node, node.origin || nodeOrigin).positionAbsolute;

          return (
            <NodeComponent
              key={node.id}
              x={x}
              y={y}
              width={node.width!}
              height={node.height!}
              style={node.style}
              className={nodeClassNameFunc(node)}
              color={nodeColorFunc(node)}
              borderRadius={nodeBorderRadius}
              strokeColor={nodeStrokeColorFunc(node)}
              strokeWidth={nodeStrokeWidth}
              shapeRendering={shapeRendering}
              onClick={onSvgNodeClick}
              id={node.id}
            />
          );
        })}
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

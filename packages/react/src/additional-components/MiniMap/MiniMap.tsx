/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useRef, type MouseEvent, useCallback, CSSProperties } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import { getInternalNodesBounds, getBoundsOfRects, XYMinimap, type Rect, type XYMinimapInstance } from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { Panel } from '../../components/Panel';
import type { ReactFlowState, Node } from '../../types';

import MiniMapNodes from './MiniMapNodes';
import type { MiniMapProps } from './types';

const defaultWidth = 200;
const defaultHeight = 150;

const filterHidden = (node: Node) => !node.hidden;

const selector = (s: ReactFlowState) => {
  const viewBB: Rect = {
    x: -s.transform[0] / s.transform[2],
    y: -s.transform[1] / s.transform[2],
    width: s.width / s.transform[2],
    height: s.height / s.transform[2],
  };

  return {
    viewBB,
    boundingRect:
      s.nodeLookup.size > 0
        ? getBoundsOfRects(getInternalNodesBounds(s.nodeLookup, { filter: filterHidden }), viewBB)
        : viewBB,
    rfId: s.rfId,
    panZoom: s.panZoom,
    translateExtent: s.translateExtent,
    flowWidth: s.width,
    flowHeight: s.height,
    ariaLabelConfig: s.ariaLabelConfig,
  };
};

const ARIA_LABEL_KEY = 'react-flow__minimap-desc';
function MiniMapComponent<NodeType extends Node = Node>({
  style,
  className,
  nodeStrokeColor,
  nodeColor,
  nodeClassName = '',
  nodeBorderRadius = 5,
  nodeStrokeWidth,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent,
  bgColor,
  maskColor,
  maskStrokeColor,
  maskStrokeWidth,
  position = 'bottom-right',
  onClick,
  onNodeClick,
  pannable = false,
  zoomable = false,
  ariaLabel,
  inversePan,
  zoomStep = 1,
  offsetScale = 5,
}: MiniMapProps<NodeType>) {
  const store = useStoreApi<NodeType>();
  const svg = useRef<SVGSVGElement>(null);
  const { boundingRect, viewBB, rfId, panZoom, translateExtent, flowWidth, flowHeight, ariaLabelConfig } = useStore(
    selector,
    shallow
  );
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
    ? useCallback((event: MouseEvent, nodeId: string) => {
        const node: NodeType = store.getState().nodeLookup.get(nodeId)!.internals.userNode;
        onNodeClick(event, node);
      }, [])
    : undefined;

  const _ariaLabel = ariaLabel ?? ariaLabelConfig['minimap.ariaLabel'];

  return (
    <Panel
      position={position}
      style={
        {
          ...style,
          '--xy-minimap-background-color-props': typeof bgColor === 'string' ? bgColor : undefined,
          '--xy-minimap-mask-background-color-props': typeof maskColor === 'string' ? maskColor : undefined,
          '--xy-minimap-mask-stroke-color-props': typeof maskStrokeColor === 'string' ? maskStrokeColor : undefined,
          '--xy-minimap-mask-stroke-width-props':
            typeof maskStrokeWidth === 'number' ? maskStrokeWidth * viewScale : undefined,
          '--xy-minimap-node-background-color-props': typeof nodeColor === 'string' ? nodeColor : undefined,
          '--xy-minimap-node-stroke-color-props': typeof nodeStrokeColor === 'string' ? nodeStrokeColor : undefined,
          '--xy-minimap-node-stroke-width-props': typeof nodeStrokeWidth === 'number' ? nodeStrokeWidth : undefined,
        } as CSSProperties
      }
      className={cc(['react-flow__minimap', className])}
      data-testid="rf__minimap"
    >
      <svg
        width={elementWidth}
        height={elementHeight}
        viewBox={`${x} ${y} ${width} ${height}`}
        className="react-flow__minimap-svg"
        role="img"
        aria-labelledby={labelledBy}
        ref={svg}
        onClick={onSvgClick}
      >
        {_ariaLabel && <title id={labelledBy}>{_ariaLabel}</title>}

        <MiniMapNodes<NodeType>
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
          fillRule="evenodd"
          pointerEvents="none"
        />
      </svg>
    </Panel>
  );
}

MiniMapComponent.displayName = 'MiniMap';

/**
 * The `<MiniMap />` component can be used to render an overview of your flow. It
 * renders each node as an SVG element and visualizes where the current viewport is
 * in relation to the rest of the flow.
 *
 * @public
 * @example
 *
 * ```jsx
 *import { ReactFlow, MiniMap } from '@xyflow/react';
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlow nodes={[...]]} edges={[...]]}>
 *      <MiniMap nodeStrokeWidth={3} />
 *    </ReactFlow>
 *  );
 *}
 *```
 */
export const MiniMap = memo(MiniMapComponent) as typeof MiniMapComponent;

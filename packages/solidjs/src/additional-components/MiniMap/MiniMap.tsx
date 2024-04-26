/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { memo, useEffect, useRef, type MouseEvent, useCallback, CSSProperties } from 'react';
import cc from 'classcat';
// import { shallow } from 'zustand/shallow';
import { getInternalNodesBounds, getBoundsOfRects, XYMinimap, type Rect, type XYMinimapInstance } from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { Panel } from '../../components/Panel';
import type { SolidFlowState, Node } from '../../types';

import MiniMapNodes from './MiniMapNodes';
import type { MiniMapProps } from './types';
import { createEffect, mergeProps, onCleanup, JSX, Show } from 'solid-js';
import { useRef } from '../../utils/hooks';

const defaultWidth = 200;
const defaultHeight = 150;

const selector = (s: SolidFlowState) => {
  const viewBB = (): Rect => ({
    x:  -s.transform.get()[0] / s.transform.get()[2],
    y: -s.transform.get()[1] / s.transform.get()[2],
    width: s.width.get() / s.transform.get()[2],
    height: s.height.get() / s.transform.get()[2],
  });

  return {
    viewBB,
    boundingRect: () =>
      s.nodeLookup.size > 0
        ? getBoundsOfRects(getInternalNodesBounds(s.nodeLookup, { nodeOrigin: s.nodeOrigin.get() }), viewBB())
        : viewBB(),
    rfId: () => s.rfId.get(),
    nodeOrigin: () => s.nodeOrigin.get(),
    panZoom: () => s.panZoom.get(),
    translateExtent: () => s.translateExtent.get(),
    flowWidth: () => s.width.get(),
    flowHeight: ()=>s.height.get(),
  };
};

const ARIA_LABEL_KEY = 'react-flow__minimap-desc';

function MiniMapComponent<NodeType extends Node = Node>(
  _p: MiniMapProps<NodeType>) {
//   {
//   style,
//   className,
//   nodeStrokeColor,
//   nodeColor,
//   nodeClassName = '',
//   nodeBorderRadius = 5,
//   nodeStrokeWidth,
//   // We need to rename the prop to be `CapitalCase` so that JSX will render it as
//   // a component properly.
//   nodeComponent,
//   bgColor,
//   maskColor,
//   maskStrokeColor,
//   maskStrokeWidth,
//   position = 'bottom-right',
//   onClick,
//   onNodeClick,
//   pannable = false,
//   zoomable = false,
//   ariaLabel = 'React Flow mini map',
//   inversePan,
//   zoomStep = 10,
//   offsetScale = 5,
// }: MiniMapProps<NodeType>) {
  const p = mergeProps({
    nodeClassName: '',
    nodeBorderRadius: 5,
    nodeComponent: MiniMapNodes,
    pannable: false,
    zoomable: false,
    position: 'bottom-right',
    ariaLabel: 'React Flow mini map',
    offsetScale: 5,
    zoomStep: 10,
  } satisfies MiniMapProps<NodeType>, _p);

  const store = useStoreApi<NodeType>();
  const svg = useRef<SVGSVGElement | null>(null);
  const { boundingRect, viewBB, rfId, panZoom, translateExtent, flowWidth, flowHeight } = useStore(selector);
  const elementWidth = () => (p.style?.width) ?? defaultWidth;
  const elementHeight = () => (p.style?.height as number) ?? defaultHeight;
  const scaledWidth = () => boundingRect().width / elementWidth();
  const scaledHeight = () => boundingRect().height / elementHeight();
  const viewScale = () => Math.max(scaledWidth(), scaledHeight());
  const viewWidth = () => viewScale() * elementWidth();
  const viewHeight = () => viewScale() * elementHeight();
  const offset = () => p.offsetScale * viewScale();
  const x = () => boundingRect().x - (viewWidth() - boundingRect().width) / 2 - offset();
  const y = () => boundingRect().y - (viewHeight() - boundingRect().height) / 2 - offset();
  const width = () => viewWidth() + offset() * 2;
  const height = () => viewHeight() + offset() * 2;
  const labelledBy = () => `${ARIA_LABEL_KEY}-${rfId()}`;
  const viewScaleRef = useRef(0);
  const minimapInstance = useRef<XYMinimapInstance | undefined>(undefined);

  createEffect(() => { 
    viewScaleRef.current = viewScale();
  })

  createEffect(() => {
    const pZoom = panZoom();
    if (svg.current && pZoom) {
      minimapInstance.current = XYMinimap({
        domNode: svg.current,
        panZoom: pZoom,
        getTransform: () => store.transform.get(),
        getViewScale: () => viewScaleRef.current,
      });

      onCleanup(() => {
        minimapInstance.current?.destroy();
      });
    }
  });

  createEffect(() => {
    minimapInstance.current?.update({
      translateExtent: translateExtent(),
      width: flowWidth(),
      height: flowHeight(),
      inversePan: p.inversePan,
      pannable: p.pannable,
      zoomStep: p.zoomStep,
      zoomable: p.zoomable,
    });
  });

  const onSvgClick = (e: MouseEvent) => {

    // onClick
    // ? (event: MouseEvent) => {
    if (p.onClick) {
      const [x, y] = minimapInstance.current?.pointer(event) || [0, 0];
      p.onClick(e, { x, y });
    }
  }

  const onSvgNodeClick = (e: MouseEvent, nodeId: string) => {
    // onNodeClick
    // ? useCallback((event: MouseEvent, nodeId: string) => {
    if (p.onNodeClick) {
      const node = store.nodeLookup.get(nodeId)!;
      p.onNodeClick(e, node);
    }
  }

  return (
    <Panel
      position={p.position}
      style={
        {
          ...p.style,
          '--xy-minimap-background-color-props': typeof p.bgColor === 'string' ? p.bgColor : undefined,
          '--xy-minimap-mask-background-color-props': typeof p.maskColor === 'string' ? p.maskColor : undefined,
          '--xy-minimap-mask-stroke-color-props': typeof p.maskStrokeColor === 'string' ? p.maskStrokeColor : undefined,
          '--xy-minimap-mask-stroke-width-props':
            typeof p.maskStrokeWidth === 'number' ? p.maskStrokeWidth * viewScale() : undefined,
          '--xy-minimap-node-background-color-props': typeof p.nodeColor === 'string' ? p.nodeColor : undefined,
          '--xy-minimap-node-stroke-color-props': typeof p.nodeStrokeColor === 'string' ? p.nodeStrokeColor : undefined,
          '--xy-minimap-node-stroke-width-props': typeof p.nodeStrokeWidth === 'string' ? p.nodeStrokeWidth : undefined,
        } as JSX.CSSProperties
      }
      class={cc(['react-flow__minimap', p.class])}
      data-testid="rf__minimap"
    >
      <svg
        width={elementWidth()}
        height={elementHeight()}
        viewBox={`${x()} ${y()} ${width()} ${height()}`}
        class="react-flow__minimap-svg"
        role="img"
        aria-labelledby={labelledBy()}
        ref={(node) => svg.current = node}
        onClick={onSvgClick}
      >
        <Show when={p.ariaLabel}>
          <title id={labelledBy()}>{p.ariaLabel}</title>
        </Show>
        {/* {ariaLabel && <title id={labelledBy}>{ariaLabel}</title>} */}
        <MiniMapNodes<NodeType>
          onClick={onSvgNodeClick}
          nodeColor={p.nodeColor}
          nodeStrokeColor={p.nodeStrokeColor}
          nodeBorderRadius={p.nodeBorderRadius}
          nodeClassName={p.nodeClassName}
          nodeStrokeWidth={p.nodeStrokeWidth}
          nodeComponent={p.nodeComponent}
        />
        <path
          class="react-flow__minimap-mask"
          d={`M${x() - offset()},${y() - offset()}h${width() + offset() * 2}v${height() + offset() * 2}h${-width() - offset() * 2}z
        M${viewBB().x},${viewBB().y}h${viewBB().width}v${viewBB().height}h${-viewBB().width}z`}
          fill-rule="evenodd"
          pointer-events="none"
        />
      </svg>
    </Panel>
  );
}

MiniMapComponent.displayName = 'MiniMap';

export const MiniMap = MiniMapComponent;

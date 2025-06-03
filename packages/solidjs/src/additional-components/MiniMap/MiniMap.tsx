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

const filterHidden = (node: Node) => !node.hidden;

const selector = (s: SolidFlowState) => {
  const viewBB = (): Rect => ({
    x: -s.transform.get()[0] / s.transform.get()[2],
    y: -s.transform.get()[1] / s.transform.get()[2],
    width: s.width.get() / s.transform.get()[2],
    height: s.height.get() / s.transform.get()[2],
  });

  return {
    viewBB,
    boundingRect: () =>
      s.nodeLookup.size > 0
        ? getBoundsOfRects(getInternalNodesBounds(s.nodeLookup, { filter: filterHidden }), viewBB())
        : viewBB(),
    rfId: () => s.rfId.get(),
    panZoom: () => s.panZoom.get(),
    translateExtent: () => s.translateExtent.get(),
    flowWidth: () => s.width.get(),
    flowHeight: () => s.height.get(),
  };
};

const ARIA_LABEL_KEY = 'react-flow__minimap-desc';

function MiniMapComponent<NodeType extends Node = Node>(_p: MiniMapProps<NodeType>) {
  const p = mergeProps(
    {
      nodeClassName: '',
      nodeBorderRadius: 5,
      position: 'bottom-right' as const,
      pannable: false,
      zoomable: false,
      ariaLabel: 'React Flow mini map',
      zoomStep: 10,
      offsetScale: 5,
    } satisfies Partial<MiniMapProps<NodeType>>,
    _p
  );

  const store = useStoreApi<NodeType>();
  let svg: SVGSVGElement | undefined;
  const storeData = useStore(selector);
  const elementWidth = () => (p.style?.width as number) ?? defaultWidth;
  const elementHeight = () => (p.style?.height as number) ?? defaultHeight;
  const scaledWidth = () => storeData.boundingRect().width / elementWidth();
  const scaledHeight = () => storeData.boundingRect().height / elementHeight();
  const viewScale = () => Math.max(scaledWidth(), scaledHeight());
  const viewWidth = () => viewScale() * elementWidth();
  const viewHeight = () => viewScale() * elementHeight();
  const offset = () => p.offsetScale * viewScale();
  const x = () => storeData.boundingRect().x - (viewWidth() - storeData.boundingRect().width) / 2 - offset();
  const y = () => storeData.boundingRect().y - (viewHeight() - storeData.boundingRect().height) / 2 - offset();
  const width = () => viewWidth() + offset() * 2;
  const height = () => viewHeight() + offset() * 2;
  const labelledBy = () => `${ARIA_LABEL_KEY}-${storeData.rfId()}`;
  let viewScaleRef = 0;
  let minimapInstance: XYMinimapInstance | undefined;

  createEffect(() => {
    viewScaleRef = viewScale();
  });

  createEffect(() => {
    const pZoom = storeData.panZoom();
    if (svg && pZoom) {
      minimapInstance = XYMinimap({
        domNode: svg,
        panZoom: pZoom,
        getTransform: () => store.transform.get(),
        getViewScale: () => viewScaleRef,
      });

      onCleanup(() => {
        minimapInstance?.destroy();
      });
    }
  });

  createEffect(() => {
    minimapInstance?.update({
      translateExtent: storeData.translateExtent(),
      width: storeData.flowWidth(),
      height: storeData.flowHeight(),
      inversePan: p.inversePan,
      pannable: p.pannable,
      zoomStep: p.zoomStep,
      zoomable: p.zoomable,
    });
  });

  const onSvgClick = p.onClick
    ? (event: MouseEvent) => {
        const [x, y] = minimapInstance?.pointer(event) || [0, 0];
        p.onClick!(event, { x, y });
      }
    : undefined;

  const onSvgNodeClick = p.onNodeClick
    ? (event: MouseEvent, nodeId: string) => {
        const node: NodeType = store.nodeLookup.get(nodeId)!.internals.userNode;
        p.onNodeClick!(event, node);
      }
    : undefined;

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
          '--xy-minimap-node-stroke-width-props': typeof p.nodeStrokeWidth === 'number' ? p.nodeStrokeWidth : undefined,
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
        ref={svg}
        onClick={onSvgClick}
      >
        <Show when={p.ariaLabel}>
          <title id={labelledBy()}>{p.ariaLabel}</title>
        </Show>
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
          d={`M${x() - offset()},${y() - offset()}h${width() + offset() * 2}v${height() + offset() * 2}h${
            -width() - offset() * 2
          }z
        M${storeData.viewBB().x},${storeData.viewBB().y}h${storeData.viewBB().width}v${
            storeData.viewBB().height
          }h${-storeData.viewBB().width}z`}
          fill-rule="evenodd"
          pointer-events="none"
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
 *import { ReactFlow, MiniMap } from '@xyflow/solid';
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
export const MiniMap = MiniMapComponent;

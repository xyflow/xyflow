import { memo, useEffect, useRef, type MouseEvent, useCallback, CSSProperties } from 'react';
import cc from 'classcat';
import { getInternalNodesBounds, getBoundsOfRects, XYMinimap, type Rect, type XYMinimapInstance } from '@xyflow/system';

import {
  useCustomDiff,
  useReactFlowStore,
  useNodesStore,
  useViewportStore,
  useReactFlowStoreApi,
  useShallow,
} from '../../hooks/useReactFlowStore';
import { Panel } from '../../components/Panel';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import type { NodesStore, ViewportStore, Node } from '../../types';

import MiniMapNodes from './MiniMapNodes';
import type { MiniMapProps } from './types';

const defaultWidth = 200;
const defaultHeight = 150;

const filterHidden = (node: Node) => !node.hidden;

const viewportSelector = ({ transform, width, height }: ViewportStore) => ({ transform, width, height });

const selector = (s: NodesStore, viewport: ReturnType<typeof viewportSelector>) => {
  const viewBB: Rect = {
    x: -viewport.transform[0] / viewport.transform[2],
    y: -viewport.transform[1] / viewport.transform[2],
    width: viewport.width / viewport.transform[2],
    height: viewport.height / viewport.transform[2],
  };

  /*
   * the bounds only cover the visible nodes, so we have to check for a visible node
   * here as well. getInternalNodesBounds returns a rect at the origin when nothing
   * passes the filter, which would stretch the bounds to include (0, 0).
   */
  let hasVisibleNode = false;

  for (const node of s.nodeLookup.values()) {
    if (!node.hidden) {
      hasVisibleNode = true;
      break;
    }
  }

  return {
    viewBB,
    boundingRect: hasVisibleNode
      ? getBoundsOfRects(getInternalNodesBounds(s.nodeLookup, { filter: filterHidden }), viewBB)
      : viewBB,
    flowWidth: viewport.width,
    flowHeight: viewport.height,
  };
};
type MiniMapSlice = ReturnType<typeof selector>;

const rectEqual = (a: Rect, b: Rect) => a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;

// the selector builds new viewBB/boundingRect objects every call, so the default shallow equality always
// treats them as changed; comparing the rects by value lets the minimap skip re-renders when nothing moved
const areEqual = (a: MiniMapSlice, b: MiniMapSlice) =>
  rectEqual(a.viewBB, b.viewBB) &&
  rectEqual(a.boundingRect, b.boundingRect) &&
  a.flowWidth === b.flowWidth &&
  a.flowHeight === b.flowHeight;

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
  const { store, viewportStore, nodesStore } = useReactFlowStoreApi<NodeType>();
  const svg = useRef<SVGSVGElement>(null);

  const rfId = useReactFlowStore((s) => s.rfId);
  const panZoom = useReactFlowStore((s) => s.panZoom);
  const translateExtent = useReactFlowStore((s) => s.translateExtent);
  const ariaLabelConfig = useReactFlowStore((s) => s.ariaLabelConfig);

  const viewport = useViewportStore(useShallow(viewportSelector));
  const { viewBB, boundingRect, flowWidth, flowHeight } = useNodesStore(
    useCustomDiff(
      useCallback((s: NodesStore) => selector(s, viewport), [viewport]),
      areEqual
    )
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
  const minimapInstance = useRef<XYMinimapInstance>();

  const viewScaleRef = useRef(viewScale);
  useIsomorphicLayoutEffect(() => {
    viewScaleRef.current = viewScale;
  }, [viewScale]);

  useEffect(() => {
    const currentPanZoom = store.getState().panZoom;
    if (svg.current && currentPanZoom) {
      minimapInstance.current = XYMinimap({
        domNode: svg.current,
        panZoom: currentPanZoom,
        getTransform: () => viewportStore.getState().transform,
        getViewScale: () => viewScaleRef.current,
      });

      return () => {
        minimapInstance.current?.destroy();
      };
    }
  }, [panZoom, store, viewportStore]);

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

  const nodeClickHandler = useCallback(
    (event: MouseEvent, nodeId: string) => {
      const internalNode = nodesStore.getState().nodeLookup.get(nodeId)!;

      if (internalNode && onNodeClick) {
        onNodeClick(event, internalNode.internals.userNode);
      }
    },
    [onNodeClick, nodesStore]
  );

  const onSvgNodeClick = onNodeClick ? nodeClickHandler : undefined;

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
          onClick={onNodeClick ? onSvgNodeClick : undefined}
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
 *    <ReactFlow nodes={[...]} edges={[...]}>
 *      <MiniMap nodeStrokeWidth={3} />
 *    </ReactFlow>
 *  );
 *}
 *```
 */
export const MiniMap = memo(MiniMapComponent) as typeof MiniMapComponent;

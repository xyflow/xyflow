<script lang="ts" module>
  declare const window: Window | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAttrFunction = (func: any): GetMiniMapNodeAttribute =>
    func instanceof Function ? func : () => func;
</script>

<script lang="ts">
  import {
    getBoundsOfRects,
    getInternalNodesBounds,
    getNodeDimensions,
    nodeHasDimensions
  } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import { Panel } from '$lib/container/Panel';
  import MinimapNode from './MinimapNode.svelte';
  import interactive from './interactive';
  import type { GetMiniMapNodeAttribute, MiniMapProps } from './types';

  let {
    position = 'bottom-right',
    ariaLabel,
    nodeStrokeColor = 'transparent',
    nodeColor,
    nodeClass = '',
    nodeBorderRadius = 5,
    nodeStrokeWidth = 2,
    nodeComponent,
    bgColor,
    maskColor,
    maskStrokeColor,
    maskStrokeWidth,
    width = 200,
    height = 150,
    pannable = true,
    zoomable = true,
    inversePan,
    zoomStep,
    class: className,
    ...rest
  }: MiniMapProps = $props();

  let store = $derived(useStore());
  let ariaLabelConfig = $derived(store.ariaLabelConfig);

  const nodeColorFunc = nodeColor === undefined ? undefined : getAttrFunction(nodeColor);
  const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
  const nodeClassFunc = getAttrFunction(nodeClass);
  const shapeRendering =
    // @ts-expect-error - TS doesn't know about chrome
    typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';

  let labelledBy = $derived(`svelte-flow__minimap-desc-${store.flowId}`);

  let viewBB = $derived({
    x: -store.viewport.x / store.viewport.zoom,
    y: -store.viewport.y / store.viewport.zoom,
    width: store.width / store.viewport.zoom,
    height: store.height / store.viewport.zoom
  });

  let boundingRect = $derived(
    getBoundsOfRects(getInternalNodesBounds(store.nodeLookup, { filter: (n) => !n.hidden }), viewBB)
  );

  let scaledWidth = $derived(boundingRect.width / width);
  let scaledHeight = $derived(boundingRect.height / height);
  let viewScale = $derived(Math.max(scaledWidth, scaledHeight));
  let viewWidth = $derived(viewScale * width);
  let viewHeight = $derived(viewScale * height);
  let offset = $derived(5 * viewScale);
  let x = $derived(boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset);
  let y = $derived(boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset);
  let viewboxWidth = $derived(viewWidth + offset * 2);
  let viewboxHeight = $derived(viewHeight + offset * 2);

  const getViewScale = () => viewScale;
</script>

<Panel
  {position}
  class={['svelte-flow__minimap', className]}
  data-testid="svelte-flow__minimap"
  --xy-minimap-background-color-props={bgColor}
  {...rest}
>
  {#if store.panZoom}
    <svg
      {width}
      {height}
      viewBox="{x} {y} {viewboxWidth} {viewboxHeight}"
      class="svelte-flow__minimap-svg"
      role="img"
      aria-labelledby={labelledBy}
      style:--xy-minimap-mask-background-color-props={maskColor}
      style:--xy-minimap-mask-stroke-color-props={maskStrokeColor}
      style:--xy-minimap-mask-stroke-width-props={maskStrokeWidth
        ? maskStrokeWidth * viewScale
        : undefined}
      use:interactive={{
        store,
        panZoom: store.panZoom,
        getViewScale,
        translateExtent: store.translateExtent,
        width: store.width,
        height: store.height,
        inversePan,
        zoomStep,
        pannable,
        zoomable
      }}
    >
      {#if ariaLabel ?? ariaLabelConfig['minimap.ariaLabel']}
        <title id={labelledBy}>{ariaLabel ?? ariaLabelConfig['minimap.ariaLabel']}</title>
      {/if}

      {#each store.nodes as userNode (userNode.id)}
        {@const node = store.nodeLookup.get(userNode.id)}
        {#if node && nodeHasDimensions(node) && !node.hidden}
          {@const nodeDimesions = getNodeDimensions(node)}
          <MinimapNode
            id={node.id}
            x={node.internals.positionAbsolute.x}
            y={node.internals.positionAbsolute.y}
            {...nodeDimesions}
            selected={node.selected}
            {nodeComponent}
            color={nodeColorFunc?.(node)}
            borderRadius={nodeBorderRadius}
            strokeColor={nodeStrokeColorFunc(node)}
            strokeWidth={nodeStrokeWidth}
            {shapeRendering}
            class={nodeClassFunc(node)}
          />
        {/if}
      {/each}
      <path
        class="svelte-flow__minimap-mask"
        d="M{x - offset},{y - offset}h{viewboxWidth + offset * 2}v{viewboxHeight +
          offset * 2}h{-viewboxWidth - offset * 2}z
      M{viewBB.x},{viewBB.y}h{viewBB.width}v{viewBB.height}h{-viewBB.width}z"
        fill-rule="evenodd"
        pointer-events="none"
      />
    </svg>
  {/if}
</Panel>

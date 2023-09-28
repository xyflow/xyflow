<script lang="ts" context="module">
  declare const window: any;

  const getAttrFunction = (func: any): GetMiniMapNodeAttribute =>
    func instanceof Function ? func : () => func;
</script>

<script lang="ts">
  import cc from 'classcat';
  import { getBoundsOfRects, getNodePositionWithOrigin, getRectOfNodes } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import { Panel } from '$lib/container/Panel';
  import MinimapNode from './MinimapNode.svelte';
  import interactive from './interactive';
  import type { GetMiniMapNodeAttribute, MiniMapProps } from './types';

  type $$Props = MiniMapProps;

  export let position: $$Props['position'] = 'bottom-right';
  export let ariaLabel: $$Props['ariaLabel'] = 'Mini map';
  export let nodeStrokeColor: $$Props['nodeStrokeColor'] = 'transparent';
  export let nodeColor: $$Props['nodeColor'] = '#e2e2e2';
  export let nodeClass: $$Props['nodeClass'] = '';
  export let nodeBorderRadius: $$Props['nodeBorderRadius'] = 5;
  export let nodeStrokeWidth: $$Props['nodeStrokeWidth'] = 2;
  export let bgColor: $$Props['bgColor'] = undefined;
  export let maskColor: $$Props['maskColor'] = undefined;
  export let maskStrokeColor: $$Props['maskStrokeColor'] = undefined;
  export let maskStrokeWidth: $$Props['maskStrokeWidth'] = undefined;
  export let width: $$Props['width'] = undefined;
  export let height: $$Props['height'] = undefined;
  export let pannable: $$Props['pannable'] = true;
  export let zoomable: $$Props['zoomable'] = true;
  export let inversePan: $$Props['inversePan'] = undefined;
  export let zoomStep: $$Props['zoomStep'] = undefined;
  export let style: $$Props['style'] = '';

  let className: $$Props['class'] = '';
  export { className as class };

  const defaultWidth = 200;
  const defaultHeight = 150;
  const {
    nodes,
    viewport,
    width: containerWidth,
    height: containerHeight,
    flowId,
    panZoom,
    translateExtent
  } = useStore();

  const nodeColorFunc = getAttrFunction(nodeColor);
  const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
  const nodeClassFunc = getAttrFunction(nodeClass);
  const shapeRendering =
    typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';
  const labelledBy = `svelte-flow__minimap-desc-${$flowId}`;

  $: viewBB = {
    x: -$viewport.x / $viewport.zoom,
    y: -$viewport.y / $viewport.zoom,
    width: $containerWidth / $viewport.zoom,
    height: $containerHeight / $viewport.zoom
  };
  $: boundingRect = $nodes.length > 0 ? getBoundsOfRects(getRectOfNodes($nodes), viewBB) : viewBB;
  $: elementWidth = width ?? defaultWidth;
  $: elementHeight = height ?? defaultHeight;
  $: scaledWidth = boundingRect.width / elementWidth;
  $: scaledHeight = boundingRect.height / elementHeight;
  $: viewScale = Math.max(scaledWidth, scaledHeight);
  $: viewWidth = viewScale * elementWidth;
  $: viewHeight = viewScale * elementHeight;
  $: offset = 5 * viewScale;
  $: x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
  $: y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
  $: viewboxWidth = viewWidth + offset * 2;
  $: viewboxHeight = viewHeight + offset * 2;

  const getViewScale = () => viewScale;
</script>

<Panel
  {position}
  {style}
  class={cc(['svelte-flow__minimap', className])}
  data-testid="svelte-flow__minimap"
>
  {#if $panZoom}
    <svg
      width={elementWidth}
      height={elementHeight}
      viewBox="{x} {y} {viewboxWidth} {viewboxHeight}"
      role="img"
      aria-labelledby={labelledBy}
      style:--minimap-background-color-props={bgColor}
      style:--minimap-mask-color-props={maskColor}
      style:--minimap-mask-stroke-color-props={maskStrokeColor}
      style:--minimap-mask-stroke-width-props={maskStrokeWidth}
      use:interactive={{
        panZoom: $panZoom,
        viewport,
        getViewScale,
        translateExtent: $translateExtent,
        width: $containerWidth,
        height: $containerHeight,
        inversePan,
        zoomStep,
        pannable,
        zoomable
      }}
    >
      {#if ariaLabel}<title id={labelledBy}>{ariaLabel}</title>{/if}

      {#each $nodes as node (node.id)}
        {#if node.width && node.height}
          {@const pos = getNodePositionWithOrigin(node).positionAbsolute}
          <MinimapNode
            x={pos.x}
            y={pos.y}
            width={node.width}
            height={node.height}
            color={nodeColorFunc(node)}
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

<style>
  svg {
    background-color: var(
      --minimap-background-color-props,
      var(--minimap-background-color, var(--minimap-background-color-default))
    );
  }

  .svelte-flow__minimap-mask {
    fill: var(
      --minimap-mask-color-props,
      var(--minimap-mask-color, var(--minimap-mask-color-default))
    );
    stroke: var(
      --minimap-mask-stroke-color-props,
      var(--minimap-mask-stroke-color, var(--minimap-mask-stroke-color-default))
    );
    stroke-width: var(
      --minimap-mask-stroke-width-props,
      var(--minimap-mask-stroke-width, var(--minimap-mask-stroke-width-default))
    );
  }
</style>

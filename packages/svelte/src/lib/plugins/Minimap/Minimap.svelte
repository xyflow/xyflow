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
  import type { GetMiniMapNodeAttribute, MiniMapProps } from './types';

  type $$Props = MiniMapProps;

  let position: $$Props['position']  = 'bottom-right';
  let ariaLabel: $$Props['ariaLabel'] = 'Mini map';
  let style: $$Props['style'] = '';
  let nodeStrokeColor: $$Props['nodeStrokeColor'] = 'transparent';
  let nodeColor: $$Props['nodeColor'] = '#e2e2e2';
  let nodeClassName: $$Props['nodeClassName'] = '';
  let nodeBorderRadius: $$Props['nodeBorderRadius'] = 5;
  let nodeStrokeWidth: $$Props['nodeStrokeWidth'] = 2;
  let bgColor: $$Props['bgColor'] = '#fff';
  let maskColor: $$Props['maskColor'] = 'rgb(240, 240, 240, 0.6)';
  let maskStrokeColor: $$Props['maskStrokeColor'] = 'none';
  let maskStrokeWidth: $$Props['maskStrokeWidth'] = 1;
  let width: $$Props['width'] = undefined;
  let height: $$Props['height'] = undefined;
  let className: $$Props['class'] = '';
  export { className as class };

  const defaultWidth = 200;
  const defaultHeight = 150;
  const { nodes, transform, width: containerWidth, height: containerHeight, flowId } = useStore();

  
  const nodeColorFunc = getAttrFunction(nodeColor);
  const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
  const nodeClassNameFunc = getAttrFunction(nodeClassName);
  const shapeRendering =
    typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';
  const labelledBy = `svelte-flow__minimap-desc-${$flowId}`;

  $: viewBB = {
    x: -$transform[0] / $transform[2],
    y: -$transform[1] / $transform[2],
    width: $containerWidth / $transform[2],
    height: $containerHeight / $transform[2]
  };
  $: boundingRect =
    $nodes.length > 0 ? getBoundsOfRects(getRectOfNodes($nodes), viewBB) : viewBB;
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
</script>

<Panel
  {position}
  class={cc(['svelte-flow__minimap', className])}
  style={`background-color: ${bgColor}; ${style}`}
  data-testid="svelte-flow__minimap"
>
  <svg
    width={elementWidth}
    height={elementHeight}
    viewBox={`${x} ${y} ${viewboxWidth} ${viewboxHeight}`}
    role="img"
    aria-labelledby={labelledBy}
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
          class={nodeClassNameFunc(node)}
          style={{}}
        />
      {/if}
    {/each}
    <path
      class="svelte-flow__minimap-mask"
      d={`M${x - offset},${y - offset}h${viewboxWidth + offset * 2}v${viewboxHeight + offset * 2}h${
        -viewboxWidth - offset * 2
      }z
    M${viewBB.x},${viewBB.y}h${viewBB.width}v${viewBB.height}h${-viewBB.width}z`}
      fill={maskColor}
      fill-rule="evenodd"
      stroke={maskStrokeColor}
      stroke-width={maskStrokeWidth}
      pointer-events="none"
    />
  </svg>
</Panel>

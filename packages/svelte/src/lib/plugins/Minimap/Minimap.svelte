<script lang="ts">
  import cc from 'classcat';
	import type { PanelPosition, Rect, Node } from '@reactflow/system';
	import { getBoundsOfRects, getNodePositionWithOrigin, getRectOfNodes } from '@reactflow/utils';

  import { useStore } from '$lib/store';
	import Panel from '$lib/container/Panel.svelte';
  import MinimapNode from './MinimapNode.svelte';

  let position: PanelPosition = 'bottom-right';
  let ariaLabel: string = 'Mini map';
  let className: string = '';
  let style: Record<string, unknown> = {};
  let nodeStrokeColor: string = 'transparent';
  let nodeColor: string = '#e2e2e2';
  let nodeClassName: string = '';
  let nodeBorderRadius: number = 5;
  let nodeStrokeWidth: number = 2;
  let maskColor: string = 'rgb(240, 240, 240, 0.6)';
  let maskStrokeColor: string = 'none';
  let maskStrokeWidth: number = 1;
  export { className as class };

  const defaultWidth = 200;
  const defaultHeight = 150;
  const { nodesStore, transformStore, widthStore, heightStore, nodeOriginStore, idStore } = useStore();

  type GetMiniMapNodeAttribute = (node: Node) => string;
  const getAttrFunction = (func: any): GetMiniMapNodeAttribute => (func instanceof Function ? func : () => func);
  const nodeColorFunc = getAttrFunction(nodeColor);
  const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
  const nodeClassNameFunc = getAttrFunction(nodeClassName);
  const shapeRendering = typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';
  const labelledBy = `react-flow__minimap-desc-${$idStore}`;
  
  $: viewBB = {
    x: -$transformStore[0] / $transformStore[2],
    y: -$transformStore[1] / $transformStore[2],
    width: $widthStore / $transformStore[2],
    height: $heightStore / $transformStore[2],
  } as Rect;
  $: boundingRect = $nodesStore.length > 0 ? getBoundsOfRects(getRectOfNodes($nodesStore, $nodeOriginStore), viewBB) : viewBB
  $: elementWidth = (style?.width as number) ?? defaultWidth;
  $: elementHeight = (style?.height as number) ?? defaultHeight;  
  $: scaledWidth = boundingRect.width / elementWidth;
  $: scaledHeight = boundingRect.height / elementHeight;
  $: viewScale = Math.max(scaledWidth, scaledHeight);
  $: viewWidth = viewScale * elementWidth;
  $: viewHeight = viewScale * elementHeight;
  $: offset = 5 * viewScale;
  $: x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
  $: y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
  $: width = viewWidth + offset * 2;
  $: height = viewHeight + offset * 2;
</script>

<Panel position={position} class={cc(['react-flow__minimap', className])}>
  <svg
    width={elementWidth}
    height={elementHeight}
    viewBox={`${x} ${y} ${width} ${height}`}
    role="img"
    aria-labelledby={labelledBy}
  >
    {#if ariaLabel}<title id={labelledBy}>{ariaLabel}</title>{/if}

    {#each $nodesStore as node}
      {#if node.width && node.height}
        {@const pos = getNodePositionWithOrigin(node, $nodeOriginStore).positionAbsolute}
        <MinimapNode
          x={pos.x}
          y={pos.y}
          width={node.width}
          height={node.height}
          color={nodeColorFunc(node)}
          borderRadius={nodeBorderRadius}
          strokeColor={nodeStrokeColorFunc(node)}
          strokeWidth={nodeStrokeWidth}
          shapeRendering={shapeRendering}
          class={nodeClassNameFunc(node)}
          style={{}}
        />
      {/if}
    {/each}
    <path
      class="react-flow__minimap-mask"
      d={`M${x - offset},${y - offset}h${width + offset * 2}v${height + offset * 2}h${-width - offset * 2}z
    M${viewBB.x},${viewBB.y}h${viewBB.width}v${viewBB.height}h${-viewBB.width}z`}
      fill={maskColor}
      fill-rule="evenodd"
      stroke={maskStrokeColor}
      stroke-width={maskStrokeWidth}
      pointer-events="none"
    />
  </svg>
</Panel>

<style>
  .react-flow__minimap {
    background-color: #fff;
  }
</style>
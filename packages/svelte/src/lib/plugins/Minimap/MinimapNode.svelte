<script lang="ts">
  import type { Component } from 'svelte';
  import type { MiniMapNodeProps } from './types';
  import { useInternalNode } from '$lib/hooks/useInternalNode.svelte';
  import { getNodeDimensions } from '@xyflow/system';

  let {
    id,
    x: xProp,
    y: yProp,
    width: widthProp,
    height: heightProp,
    borderRadius = 5,
    color,
    shapeRendering,
    strokeColor,
    strokeWidth = 2,
    selected,
    class: className,
    nodeComponent
  }: MiniMapNodeProps & {
    nodeComponent?: Component<MiniMapNodeProps>;
  } = $props();

  let internalNode = $derived(useInternalNode(id));

  let { width, height, x, y } = $derived.by(() => {
    if (!internalNode.current) {
      return { width: 0, height: 0, x: 0, y: 0 };
    }

    const { width, height } = getNodeDimensions(internalNode.current);

    return {
      width: widthProp ?? width,
      height: heightProp ?? height,
      x: xProp ?? internalNode.current.internals.positionAbsolute.x,
      y: yProp ?? internalNode.current.internals.positionAbsolute.y
    };
  });
</script>

{#if nodeComponent}
  {@const CustomComponent = nodeComponent}

  <CustomComponent
    {id}
    {x}
    {y}
    {width}
    {height}
    {borderRadius}
    class={className}
    {color}
    {shapeRendering}
    {strokeColor}
    {strokeWidth}
    {selected}
  />
{:else}
  <rect
    class={['svelte-flow__minimap-node', className]}
    class:selected
    {x}
    {y}
    rx={borderRadius}
    ry={borderRadius}
    {width}
    {height}
    style:fill={color}
    style:stroke={strokeColor}
    style:stroke-width={strokeWidth}
    shape-rendering={shapeRendering}
  />
{/if}

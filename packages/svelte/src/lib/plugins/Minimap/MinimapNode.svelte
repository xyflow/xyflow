<script lang="ts">
  import type { ClassValue } from 'svelte/elements';
  import type { Component } from 'svelte';
  import type { MiniMapNodeProps } from './types';

  let {
    id,
    x,
    y,
    width,
    height,
    borderRadius = 5,
    color,
    shapeRendering,
    strokeColor,
    strokeWidth = 2,
    selected,
    class: className,
    nodeComponent
  }: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    borderRadius?: number;
    color?: string;
    shapeRendering: string;
    strokeColor?: string;
    strokeWidth?: number;
    selected?: boolean;
    class?: ClassValue;
    nodeComponent?: Component<MiniMapNodeProps>;
  } = $props();
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

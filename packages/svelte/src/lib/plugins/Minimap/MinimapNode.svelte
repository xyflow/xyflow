<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  let {
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
    class: className
  }: {
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
  } = $props();
</script>

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

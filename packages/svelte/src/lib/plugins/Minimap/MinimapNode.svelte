<script lang="ts">
  import cc from 'classcat';

  export let x: number;
  export let y: number;
  export let width: number = 0;
  export let height: number = 0;
  export let borderRadius: number;
  export let color: string;
  export let shapeRendering: string;
  export let strokeColor: string;
  export let strokeWidth: number;
  export let className: string = '';
  export let style: Record<string, string>;

  export { className as class };

  const { background, backgroundColor } = style || {};
  const fill = (color || background || backgroundColor) as string;
</script>

<rect
  class={cc(['react-flow__minimap-node', className])}
  x={x}
  y={y}
  rx={borderRadius}
  ry={borderRadius}
  width={width}
  height={height}
  fill={fill}
  stroke={strokeColor}
  stroke-width={strokeWidth}
  shape-rendering={shapeRendering}
/>
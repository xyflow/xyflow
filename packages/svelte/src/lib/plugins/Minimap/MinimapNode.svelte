<script lang="ts">
  import cc from 'classcat';

  export let x: number;
  export let y: number;
  export let width: number = 0;
  export let height: number = 0;
  export let borderRadius: number = 5;
  export let color: string;
  export let shapeRendering: string;
  export let strokeColor: string;
  export let strokeWidth: number = 2;
  let className: string = '';
  export { className as class };
</script>

<rect
  class={cc(['svelte-flow__minimap-node', className])}
  {x}
  {y}
  rx={borderRadius}
  ry={borderRadius}
  {width}
  {height}
  fill={color}
  stroke={strokeColor}
  stroke-width={strokeWidth}
  shape-rendering={shapeRendering}
/>

<script lang="ts">
  import cc from 'classcat';

  export let x: number;
  export let y: number;
  export let width: number = 0;
  export let height: number = 0;
  export let borderRadius: number = 5;
  export let color: string | undefined = undefined;
  export let shapeRendering: string;
  export let strokeColor: string | undefined = undefined;
  export let strokeWidth: number = 2;
  export let selected: boolean = false;
  let className: string = '';
  export { className as class };
</script>

<rect
  class={cc(['svelte-flow__minimap-node', className])}
  class:selected
  {x}
  {y}
  rx={borderRadius}
  ry={borderRadius}
  {width}
  {height}
  style={`${color ? `fill: ${color};` : ''}${strokeColor ? `stroke: ${strokeColor};` : ''}${
    strokeWidth ? `stroke-width: ${strokeWidth};` : ''
  }`}
  shape-rendering={shapeRendering}
/>

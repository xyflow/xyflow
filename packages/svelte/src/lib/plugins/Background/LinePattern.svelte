<script lang="ts">
  export let lineWidth = 1;
  export let color = "#777";
  export let dimensions: [number, number];
</script>

<path
  stroke={color}
  stroke-width={lineWidth}
  d={`M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${
    dimensions[0]
  }`}
/>
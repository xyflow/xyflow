<script lang="ts">
  export let lineWidth = 1;
  export let color: string | undefined = undefined;
  export let dimensions: [number, number];
</script>

<path
  stroke-width={lineWidth}
  d={`M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}`}
  style:--pattern-color-props={color}
/>

<style>
  path {
    stroke: var(
      --pattern-color-props,
      var(--background-pattern-color),
      var(--background-pattern-color-default)
    );
  }
</style>

<script lang="ts">
  export let radius = 5;
  export let color: string | undefined = undefined;
</script>

<circle cx={radius} cy={radius} r={radius} style:--pattern-color-props={color} />

<style>
  circle {
    fill: var(
      --pattern-color-props,
      var(--background-pattern-color),
      var(--background-pattern-color-default)
    );
  }
</style>

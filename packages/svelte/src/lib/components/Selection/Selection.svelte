<script lang="ts">
  export let x: number | null = 0;
  export let y: number | null = 0;
  export let width: number | string | null = 0;
  export let height: number | string | null = 0;
  export let isVisible: boolean = true;
</script>

{#if isVisible}
  <div
    class="svelte-flow__selection"
    style:width={typeof width === 'string' ? width : `${width}px`}
    style:height={typeof height === 'string' ? height : `${height}px`}
    style:transform={`translate(${x}px, ${y}px)`}
  />
{/if}

<style>
  .svelte-flow__selection {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

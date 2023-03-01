<script lang="ts">
  export let x: number | null = 0;
  export let y: number | null = 0;
  export let width: number | null = 0;
  export let height: number | null = 0;
  export let isVisible: boolean = true;
</script>

{#if isVisible}
  <div
    class="svelte-flow__selection"
    style={`width: ${width}px; height: ${height}px; transform: translate(${x}px, ${y}px)`}
  />
{/if}

<style>
  .svelte-flow__selection {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 89, 220, 0.08);
    border: 1px dotted rgba(0, 89, 220, 0.8);
    z-index: 6;
  }

  .svelte-flow__selection:focus,
  .svelte-flow__selection:focus-visible {
    outline: none;
  }
</style>

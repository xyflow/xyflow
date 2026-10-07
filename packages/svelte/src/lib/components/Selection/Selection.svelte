<script lang="ts">
  import { toPxString } from '$lib/utils/index.js';

  let {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    isVisible = true
  }: {
    x?: number | undefined;
    y?: number | undefined;
    width?: number | string | undefined;
    height?: number | string | undefined;
    isVisible?: boolean;
  } = $props();
</script>

{#if isVisible}
  <div
    class="svelte-flow__selection"
    style:width={typeof width === 'string' ? width : toPxString(width)}
    style:height={typeof height === 'string' ? height : toPxString(height)}
    style:transform={`translate(${x}px, ${y}px)`}
  ></div>
{/if}

<style>
  .svelte-flow__selection {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

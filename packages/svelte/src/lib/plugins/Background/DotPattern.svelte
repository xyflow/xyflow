<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  let { radius, class: className }: { radius: number; class?: ClassValue } = $props();
</script>

<circle
  cx={radius}
  cy={radius}
  r={radius}
  class={['svelte-flow__background-pattern', 'dots', className]}
/>

<script lang="ts">
  import type { OptionalOrUndefined } from '@xyflow/system';
  import type { ClassValue } from 'svelte/elements';

  let { radius, class: className }: OptionalOrUndefined<{ radius: number; class?: ClassValue }> =
    $props();
</script>

<circle
  cx={radius}
  cy={radius}
  r={radius}
  class={['svelte-flow__background-pattern', 'dots', className]}
/>

<script lang="ts">
  import BaseSmoothStepEdge from './BaseSmoothStepEdge.svelte';
  import type { SmoothStepEdgeProps } from '$lib/types';

  type $$Props = SmoothStepEdgeProps;

  $: props = $$props as $$Props;
</script>

<BaseSmoothStepEdge {...props} />

<script lang="ts">
  import BaseSmoothStepEdge from './BaseSmoothStepEdge.svelte';
  import type { EdgeProps } from '$lib/types';

  type $$Props = EdgeProps;

  $: props = $$props as $$Props;
</script>

<BaseSmoothStepEdge {...props} internal />

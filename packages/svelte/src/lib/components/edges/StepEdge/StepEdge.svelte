<script lang="ts">
  import BaseStepEdge from './BaseStepEdge.svelte';
  import type { StepEdgeProps } from '$lib/types';

  type $$Props = StepEdgeProps;

  $: props = $$props as $$Props;
</script>

<BaseStepEdge {...props} />

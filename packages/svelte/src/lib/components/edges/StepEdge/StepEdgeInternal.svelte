<script lang="ts">
  import BaseStepEdge from './BaseStepEdge.svelte';
  import type { EdgeProps } from '$lib/types';

  type $$Props = EdgeProps;

  $: props = $$props as $$Props;
</script>

<BaseStepEdge {...props} internal />

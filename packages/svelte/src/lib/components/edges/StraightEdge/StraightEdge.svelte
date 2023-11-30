<script lang="ts">
  import BaseStraighEdge from './BaseStraightEdge.svelte';
  import type { StraightEdgeProps } from '$lib/types';

  type $$Props = StraightEdgeProps;

  $: props = $$props as $$Props;
</script>

<BaseStraighEdge {...props} />

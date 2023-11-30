<script lang="ts">
  import BaseStraighEdge from './BaseStraightEdge.svelte';
  import type { EdgeProps } from '$lib/types';

  type $$Props = EdgeProps;

  $: props = $$props as $$Props;
</script>

<BaseStraighEdge {...props} internal />

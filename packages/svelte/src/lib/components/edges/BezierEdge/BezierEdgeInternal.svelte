<script lang="ts">
  import BaseBezierEdge from './BaseBezierEdge.svelte';
  import type { EdgeProps } from '$lib/types';

  type $$Props = EdgeProps;

  $: props = $$props as $$Props;
</script>

<BaseBezierEdge {...props} internal />

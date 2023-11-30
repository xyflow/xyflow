<script lang="ts">
  import BaseBezierEdge from './BaseBezierEdge.svelte';
  import type { BezierEdgeProps } from '$lib/types';

  type $$Props = BezierEdgeProps;

  $: props = $$props as $$Props;
</script>

<BaseBezierEdge {...props} />

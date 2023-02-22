<script lang="ts">
  import { getBezierPath } from '@reactflow/edge-utils';
	import type { EdgeProps } from '$lib/types';

  interface $$Props extends EdgeProps {}

  export let id: $$Props['id'];
  export let sourceX: $$Props['sourceX'] = 0;
  export let sourceY: $$Props['sourceY'] = 0;
  export let targetX: $$Props['targetX'] = 0;
  export let targetY: $$Props['targetY'] = 0;
  export let sourcePosition: $$Props['sourcePosition'] = undefined;
  export let targetPosition: $$Props['targetPosition'] = undefined;

  $: [path] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
</script>

<path
  d={path}
  class="react-flow__edge-path"
/>
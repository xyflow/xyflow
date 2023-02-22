<script lang="ts">
  import { getStraightPath } from '@reactflow/edge-utils';
	import type { EdgeProps } from '$lib/types';

  interface $$Props extends EdgeProps {}

  export let id: $$Props['id'];
  export let sourceX: $$Props['sourceX'] = 0;
  export let sourceY: $$Props['sourceY'] = 0;
  export let targetX: $$Props['targetX'] = 0;
  export let targetY: $$Props['targetY'] = 0;

  $: [path] = getStraightPath({ sourceX, sourceY, targetX, targetY });
</script>

<path
  d={path}
  class="react-flow__edge-path"
/>
<script lang="ts">
  import cc from 'classcat';
  import type { BackgroundVariant } from './types';

  export let lineWidth = 1;
  export let dimensions: [number, number];
  export let variant: BackgroundVariant | undefined = undefined;
  let className: string = '';
  export { className as class };
</script>

<path
  stroke-width={lineWidth}
  d={`M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}`}
  class={cc(['svelte-flow__background-pattern', variant, className])}
/>

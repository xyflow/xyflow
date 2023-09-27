<script lang="ts">
  import cc from 'classcat';

  export let radius = 5;
  let className: string = '';
  export { className as class };
</script>

<circle
  cx={radius}
  cy={radius}
  r={radius}
  class={cc(['svelte-flow__background-pattern', 'dots', className])}
/>

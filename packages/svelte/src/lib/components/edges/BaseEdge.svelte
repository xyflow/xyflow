<script lang="ts">
  export let id: string = '1';
  export let type: string = 'default';
  export let sourceX: number = 0;
  export let sourceY: number = 0;
  export let targetX: number = 0;
  export let targetY: number = 0;

  const path = `M ${sourceX},${sourceY}L ${targetX},${targetY}`;

</script>

<g
  class="react-flow__edge"
  data-id={id}
>
  <path
    d={path}
    fill="none"
    class="react-flow__edge-path"
  />
</g>

<style>
  .react-flow__edge-path {
    stroke: #ccc;
    stroke-width: 1;
  }
</style>
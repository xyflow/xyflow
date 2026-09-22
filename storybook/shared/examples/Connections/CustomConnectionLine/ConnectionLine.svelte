<script lang="ts">
  import { useConnection } from '@xyflow/svelte';
  const connection = useConnection();
</script>

{#if connection.current.inProgress}
  {@const from = connection.current.from}
  {@const to = connection.current.to}
  <path
    fill="none"
    stroke="#222"
    stroke-width={1.5}
    class="animated"
    d={`M${from.x},${from.y} C ${from.x} ${to.y} ${from.x} ${to.y} ${to.x},${to.y}`}
  />
  <circle cx={to.x} cy={to.y} fill="#fff" r={3} stroke="#222" stroke-width={1.5} />
{/if}

<script lang="ts">
  import { useConnection, Panel } from '@xyflow/svelte';
  const connection = useConnection();
</script>

{#if connection.current.inProgress}
  <Panel position="bottom-center">
    <strong>connection info</strong>
    <div>position: {JSON.stringify(connection.current.to)}</div>
    <div>status: {String(connection.current.isValid)}</div>
    <div>from node id: {connection.current.fromNode?.id}</div>
    <div>from handle type: {connection.current.fromHandle?.type}</div>
    <div>to node id: {connection.current.toNode?.id}</div>
    <div>to handle type: {connection.current.toHandle?.type}</div>
  </Panel>
{/if}

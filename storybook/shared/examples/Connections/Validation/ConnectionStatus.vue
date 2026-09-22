<script setup lang="ts">
import { useConnection } from '@xyflow/vue';
import styles from './validation.module.css';
const connection = useConnection();
</script>
<template>
  <div v-if="connection.inProgress" :class="styles.connectionstatus">
    <strong>connection info</strong>
    <div>position: {{ JSON.stringify(connection.to) }}</div>
    <div>status: {{ connection.isValid }}</div>
    <div>from node id: {{ connection.fromNode?.id }}</div>
    <div>from handle type: {{ connection.fromHandle?.type }}</div>
    <div>to node id: {{ connection.toNode?.id }}</div>
    <div>to handle type: {{ connection.toHandle?.type }}</div>
  </div>
</template>

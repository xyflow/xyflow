<script lang="ts" setup>
import type { ConnectEndEvent, Connection, Node, NodeProps, OnConnectStartParams, ValidConnectionFunc, VueFlowInstance } from '@xyflow/vue';
import { VueFlow } from '@xyflow/vue';
import CustomInput from './CustomInput.vue';
import CustomNode from './CustomNode.vue';

const flow = ref<VueFlowInstance>();

const nodes = ref<Node[]>([
  {
    id: '0',
    type: 'custominput',
    position: { x: 0, y: 150 },
    data: { isValidTargetPos: (connection: Connection) => connection.target === 'B' },
  },
  {
    id: 'A',
    type: 'customnode',
    position: { x: 250, y: 0 },
    data: { isValidSourcePos: () => false },
  },
  {
    id: 'B',
    type: 'customnode',
    position: { x: 250, y: 150 },
    data: { isValidSourcePos: (connection: Connection) => connection.target === 'B' },
  },
  {
    id: 'C',
    type: 'customnode',
    position: { x: 250, y: 300 },
    data: { isValidSourcePos: (connection: Connection) => connection.target === 'B' },
  },
]);

function onConnectStart({ nodeId, handleType }: OnConnectStartParams) {
  return console.log('on connect start', { nodeId, handleType });
}

function onConnectEnd({ event, connectionState }: ConnectEndEvent) {
  return console.log('on connect end', event, connectionState);
}

function onConnect(params: Connection) {
  console.log('on connect', params);
  flow.value?.addEdges(params);
}
</script>

<template>
  <VueFlow
    ref="flow"
    :nodes="nodes"
    :select-nodes-on-drag="false"
    class="validationflow"
    @connect="onConnect"
    @connect-start="onConnectStart"
    @connect-end="onConnectEnd"
  >
    <!-- each slot only renders for its node type, so cast the wide slot props to the typed child's props
         (the dynamic slot key can't narrow `type`/`data` on its own). -->
    <template #node-custominput="props">
      <CustomInput v-bind="props as unknown as NodeProps<Node<{ isValidTargetPos: ValidConnectionFunc }, 'custominput'>>" />
    </template>
    <template #node-customnode="props">
      <CustomNode v-bind="props as unknown as NodeProps<Node<{ isValidSourcePos: ValidConnectionFunc }, 'customnode'>>" />
    </template>
  </VueFlow>
</template>

<style>
@import 'validation.css';
</style>

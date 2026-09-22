<script setup lang="ts">
import { VueFlow, Background, setupVueFlow, type ConnectEndEvent } from '@xyflow/vue';
import { defaultFlowProps } from '../../../defaultFlow';
import { useFlowFixture } from '../../../vue/useFlowFixture';
import { dropPosition } from './config';
const { nodes, edges, onConnect } = useFlowFixture(defaultFlowProps);
const { screenToFlowPosition } = setupVueFlow();
function onConnectEnd({ event, connectionState: connection }: ConnectEndEvent) {
  if (
    connection.isValid ||
    !connection.fromNode ||
    !(event.target instanceof Element) ||
    !event.target.classList.contains('vue-flow__pane')
  )
    return;
  const point = dropPosition(event);
  if (!point) return;
  const id = crypto.randomUUID();
  nodes.value = [
    ...nodes.value,
    { id, position: screenToFlowPosition(point), origin: [0.5, 0], data: { label: 'New node' } },
  ];
  const from = connection.fromNode.id;
  const handle = connection.fromHandle;
  edges.value = [
    ...edges.value,
    {
      id: 'edge-' + id,
      ...(handle?.type === 'target'
        ? { source: id, target: from, targetHandle: handle.id }
        : { source: from, sourceHandle: handle?.id, target: id }),
    },
  ];
}
</script>
<template>
  <VueFlow
    v-bind="defaultFlowProps"
    v-model:nodes="nodes"
    v-model:edges="edges"
    @connect="onConnect"
    @connect-end="onConnectEnd"
    ><Background
  /></VueFlow>
</template>

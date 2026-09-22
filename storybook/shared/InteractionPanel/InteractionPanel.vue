<script setup lang="ts">
import { Panel, useVueFlow, type Edge } from '@xyflow/vue';
import { action } from 'storybook/actions';
import { createInteractionPanel, panelActions } from './actions';
import './styles.css';
const flow = useVueFlow();
const actions = createInteractionPanel(
  {
    getNodes: () =>
      flow.getNodes.value.map((node) => ({ ...node, class: typeof node.class === 'string' ? node.class : undefined })),
    getEdges: () => [...flow.getEdges.value],
    setNodes: (nodes) => flow.setNodes(nodes),
    setEdges: (edges) => flow.setEdges(edges as Edge[]),
    addNodes: (nodes) => flow.addNodes(nodes),
    setViewport: flow.setViewport,
    deleteElements: flow.deleteElements,
    updateNodeData: flow.updateNodeData,
    toObject: flow.toObject,
  },
  'vue',
  (name, value) => action(name)(value)
);
</script>
<template>
  <Panel position="top-right" class="interaction-panel">
    <button
      v-for="{ id, label } in panelActions"
      :key="id"
      type="button"
      v-bind="{ 'data-action': id }"
      @click="actions[id]()"
    >
      {{ label }}
    </button>
  </Panel>
</template>

<script setup lang="ts">
import { VueFlow, Background, Controls, MiniMap, SelectionMode } from '@xyflow/vue';
import { defaultFlowProps } from '../../defaultFlow';
import { figmaFlowProps, type BasicArgs } from './config';
import { useFlowFixture } from '../../vue/useFlowFixture';
import InteractionPanel from '../../InteractionPanel/InteractionPanel.vue';
defineProps<BasicArgs>();
const { nodes, edges, resetKey, onConnect } = useFlowFixture(defaultFlowProps);
</script>
<template>
  <VueFlow
    :key="resetKey"
    v-bind="{ ...defaultFlowProps, ...(figma ? figmaFlowProps : {}) }"
    v-model:nodes="nodes"
    v-model:edges="edges"
    :style="{ display: isHidden ? 'none' : 'block' }"
    :selection-mode="figma ? SelectionMode.Partial : SelectionMode.Full"
    :multi-selection-key-code="figma ? ['Meta', 'Shift'] : undefined"
    @connect="onConnect"
    @pane-context-menu="(event) => figma && event.preventDefault()"
  >
    <Background /><Controls /><MiniMap /><InteractionPanel />
  </VueFlow>
</template>

<script setup lang="ts">
import { Background, VueFlow } from '@xyflow/vue';
import { initialNodes, type SharedBackgroundArgs } from './config';
import { useFlowFixture } from '../../vue/useFlowFixture';
const props = defineProps<SharedBackgroundArgs>();
const { nodes } = useFlowFixture({ nodes: [...initialNodes] });
</script>
<template>
  <VueFlow v-model:nodes="nodes" :default-viewport="{ x: 0, y: 0, zoom: 1 }">
    <Background
      v-bind="props"
      :variant="props.variant === 'cross' ? 'lines' : props.variant"
      :class="props.className"
      :style="{ ...props.style, backgroundColor: props.bgColor }"
    >
      <!-- Vue exposes a pattern slot instead of a built-in cross variant. -->
      <template v-if="props.variant === 'cross'" #pattern>
        <path
          class="cross"
          :d="
            'M' +
            (props.size ?? 6) / 2 +
            ' 0 V' +
            (props.size ?? 6) +
            ' M0 ' +
            (props.size ?? 6) / 2 +
            ' H' +
            (props.size ?? 6)
          "
          :stroke="props.color ?? '#b1b1b7'"
          :stroke-width="props.lineWidth ?? 1"
        />
      </template>
    </Background>
  </VueFlow>
</template>

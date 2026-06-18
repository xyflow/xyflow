<script lang="ts" setup>
import type { Node } from '@xyflow/vue';
import { storeToRefs, useStore, useVueFlow } from '@xyflow/vue';

const { addSelectedNodes, getNodes, viewport } = useVueFlow();

const { nodesSelectionActive } = storeToRefs(useStore());

function selectAll() {
  addSelectedNodes(getNodes.value as unknown as Node[]);
  nodesSelectionActive.value = true;
}
</script>

<template>
  <aside>
    <div class="description">
      This is an example of how you can access the internal state outside of the Vue VueFlow component.
    </div>
    <div class="title">
      Zoom & pan transform
    </div>
    <div class="transform">
      {{ [viewport.x.toFixed(2), viewport.y.toFixed(2), viewport.zoom.toFixed(2)] }}
    </div>
    <div class="title">
      Nodes
    </div>
    <div v-for="node of getNodes" :key="node.id">
      Node {{ node.id }} - x: {{ node.position.x.toFixed(2) }}, y: {{ node.position.y.toFixed(2) }}
    </div>

    <div class="selectall">
      <button @click="selectAll">
        select all nodes
      </button>
    </div>
  </aside>
</template>

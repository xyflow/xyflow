<script lang="ts">
import type { Edge, FlowEvents, Node, VueFlowInstance } from '@xyflow/vue';
import { Background, Controls, isEdge, isNode, MiniMap, VueFlow } from '@xyflow/vue';

export default defineComponent({
  name: 'BasicOptionsAPI',
  components: { VueFlow, Background, MiniMap, Controls },
  data() {
    return {
      // NOTE: don't keep the `VueFlowInstance` in reactive `data()` — Vue's ref-unwrapping over the store's
      // many refs breaks `defineComponent`'s type inference. Reach the store via the `<VueFlow>` template
      // ref instead (it exposes the store through `defineExpose`).
      elements: [
        { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, class: 'light' },
        { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, class: 'light' },
        { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, class: 'light' },
        { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, class: 'light' },
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e1-3', source: '1', target: '3' },
      ] as (Node | Edge)[],
    };
  },
  computed: {
    nodes(): Node[] {
      return this.elements.filter(isNode);
    },
    edges(): Edge[] {
      return this.elements.filter(isEdge);
    },
    // NOTE: don't expose the `VueFlowInstance` via `data()`/`computed` — Vue's ref-unwrapping over the store
    // breaks `defineComponent` inference. Reach it inside method bodies via the template ref instead.
  },
  methods: {
    logToObject() {
      console.log((this.$refs.flow as VueFlowInstance | undefined)?.toObject());
    },
    resetTransform() {
      ;(this.$refs.flow as VueFlowInstance | undefined)?.setViewport({ x: 0, y: 0, zoom: 1 });
    },
    toggleclass() {
      this.elements = this.elements.map(el => ({ ...el, class: el.class === 'light' ? 'dark' : 'light' }));
    },
    updatePos() {
      this.elements = this.elements.map(el =>
        isNode(el)
          ? {
              ...el,
              position: {
                x: Math.random() * 400,
                y: Math.random() * 400,
              },
            }
          : el,
      );
    },
    onNodeDragStop(e: FlowEvents['nodeDragStop']) {
      console.log('drag stop', e);
    },
    onInit(instance: VueFlowInstance) {
      instance.fitView();
    },
    onConnect(params: FlowEvents['connect']) {
      ;(this.$refs.flow as VueFlowInstance | undefined)?.addEdges([params]);
    },
  },
});
</script>

<template>
  <VueFlow
    ref="flow"
    :nodes="nodes"
    :edges="edges"
    class="vue-flow-basic-example"
    :default-viewport="{ zoom: 1.5 }"
    :min-zoom="0.2"
    :max-zoom="4"
    :zoom-on-scroll="false"
    fit-view
    @connect="onConnect"
    @init="onInit"
    @node-drag-stop="onNodeDragStop"
  >
    <Background />
    <MiniMap />
    <Controls />
    <div style="position: absolute; right: 10px; top: 10px; z-index: 4">
      <button style="margin-right: 5px" @click="resetTransform">
        reset transform
      </button>
      <button style="margin-right: 5px" @click="updatePos">
        change pos
      </button>
      <button style="margin-right: 5px" @click="toggleclass">
        toggle class
      </button>
      <button @click="logToObject">
        toObject
      </button>
    </div>
  </VueFlow>
</template>

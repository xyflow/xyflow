<script lang="ts" setup>
import { Panel, storeToRefs, useStore } from '@xyflow/vue';

const captureZoomClick = defineModel<boolean>('captureZoomClick', { required: true });
const captureZoomScroll = defineModel<boolean>('captureZoomScroll', { required: true });

const {
  nodesDraggable,
  nodesConnectable,
  elementsSelectable,
  zoomOnScroll,
  zoomOnDoubleClick,
  zoomOnPinch,
  panOnScroll,
  panOnScrollMode,
  panOnDrag,
} = storeToRefs(useStore());
</script>

<template>
  <Panel position="top-left">
    <div>
      <label for="draggable">
        nodesDraggable
        <input id="draggable" v-model="nodesDraggable" type="checkbox" class="vue-flow__draggable">
      </label>
    </div>
    <div>
      <label for="connectable">
        nodesConnectable
        <input id="connectable" v-model="nodesConnectable" type="checkbox" class="vue-flow__connectable">
      </label>
    </div>
    <div>
      <label for="selectable">
        elementsSelectable
        <input id="selectable" v-model="elementsSelectable" type="checkbox" class="vue-flow__selectable">
      </label>
    </div>
    <div>
      <label for="zoomonscroll">
        zoomOnScroll
        <input id="zoomonscroll" v-model="zoomOnScroll" type="checkbox" class="vue-flow__zoomonscroll">
      </label>
    </div>
    <div>
      <label for="zoomonpinch">
        zoomOnPinch
        <input id="zoomonpinch" v-model="zoomOnPinch" type="checkbox" class="vue-flow__zoomonpinch">
      </label>
    </div>
    <div>
      <label for="panonscroll">
        panOnScroll
        <input id="panonscroll" v-model="panOnScroll" type="checkbox" class="vue-flow__panonscroll">
      </label>
    </div>
    <div>
      <label>
        panOnScrollMode
        <select id="panonscrollmode" v-model="panOnScrollMode" class="vue-flow__panonscrollmode">
          <option value="free">free</option>
          <option value="horizontal">horizontal</option>
          <option value="vertical">vertical</option>
        </select>
      </label>
    </div>
    <div>
      <label for="zoomondbl">
        zoomOnDoubleClick
        <input id="zoomondbl" v-model="zoomOnDoubleClick" type="checkbox" class="vue-flow__zoomondbl">
      </label>
    </div>
    <div>
      <label for="panemoveable">
        paneMovable
        <input id="panemoveable" v-model="panOnDrag" type="checkbox" class="vue-flow__panemoveable">
      </label>
    </div>
    <div>
      <label for="capturezoompaneclick">
        capture onPaneClick
        <input id="capturezoompaneclick" v-model="captureZoomClick" type="checkbox" class="vue-flow__capturezoompaneclick">
      </label>
    </div>
    <div>
      <label for="capturezoompanescroll">
        capture onPaneScroll
        <input id="capturezoompanescroll" v-model="captureZoomScroll" type="checkbox" class="vue-flow__capturezoompanescroll">
      </label>
    </div>
  </Panel>
</template>

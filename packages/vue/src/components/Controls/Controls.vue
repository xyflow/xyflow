<script lang="ts" setup>
import type { ControlEmits, ControlProps } from './types';
import { toRef } from 'vue';
import { storeToRefs, useStore, useVueFlow } from '../../composables';
import Panel from '../Panel/Panel.vue';
import ControlButton from './ControlButton.vue';
import { FitView, Lock, MinusIcon, PlusIcon, Unlock } from './icons';

const props = withDefaults(defineProps<ControlProps>(), {
  showZoom: true,
  showFitView: true,
  showInteractive: true,
  position: 'bottom-left',
});

const emit = defineEmits<ControlEmits>();

const { setInteractive, zoomIn, zoomOut, fitView, viewport } = useVueFlow();

const { nodesDraggable, nodesConnectable, elementsSelectable, minZoom, maxZoom, ariaLabelConfig } = storeToRefs(useStore());

const isInteractive = toRef(() => nodesDraggable.value || nodesConnectable.value || elementsSelectable.value);

const minZoomReached = toRef(() => viewport.value.zoom <= minZoom.value);

const maxZoomReached = toRef(() => viewport.value.zoom >= maxZoom.value);

function onZoomInHandler() {
  zoomIn();

  emit('zoomIn');
}

function onZoomOutHandler() {
  zoomOut();

  emit('zoomOut');
}

function onFitViewHandler() {
  fitView(props.fitViewParams);

  emit('fitView');
}

function onInteractiveChangeHandler() {
  setInteractive(!isInteractive.value);

  emit('interactionChange', !isInteractive.value);
}
</script>

<script lang="ts">
export default {
  name: 'Controls',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <Panel class="vue-flow__controls" :position="position" :label="ariaLabel ?? ariaLabelConfig['controls.ariaLabel']">
    <slot name="top" />

    <template v-if="showZoom">
      <slot name="control-zoom-in">
        <ControlButton
          class="vue-flow__controls-zoomin"
          :disabled="maxZoomReached"
          :label="ariaLabelConfig['controls.zoomIn.ariaLabel']"
          @click="onZoomInHandler"
        >
          <slot name="icon-zoom-in">
            <component :is="PlusIcon" />
          </slot>
        </ControlButton>
      </slot>

      <slot name="control-zoom-out">
        <ControlButton
          class="vue-flow__controls-zoomout"
          :disabled="minZoomReached"
          :label="ariaLabelConfig['controls.zoomOut.ariaLabel']"
          @click="onZoomOutHandler"
        >
          <slot name="icon-zoom-out">
            <component :is="MinusIcon" />
          </slot>
        </ControlButton>
      </slot>
    </template>

    <template v-if="showFitView">
      <slot name="control-fit-view">
        <ControlButton
          class="vue-flow__controls-fitview"
          :label="ariaLabelConfig['controls.fitView.ariaLabel']"
          @click="onFitViewHandler"
        >
          <slot name="icon-fit-view">
            <component :is="FitView" />
          </slot>
        </ControlButton>
      </slot>
    </template>

    <template v-if="showInteractive">
      <slot name="control-interactive">
        <ControlButton
          v-if="showInteractive"
          class="vue-flow__controls-interactive"
          :label="ariaLabelConfig['controls.interactive.ariaLabel']"
          @click="onInteractiveChangeHandler"
        >
          <slot v-if="isInteractive" name="icon-unlock">
            <component :is="Unlock" />
          </slot>
          <slot v-if="!isInteractive" name="icon-lock">
            <component :is="Lock" />
          </slot>
        </ControlButton>
      </slot>
    </template>

    <slot />
  </Panel>
</template>

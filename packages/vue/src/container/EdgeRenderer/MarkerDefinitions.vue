<script lang="ts" setup>
import type { EdgeMarkerType, MarkerProps, MarkerType } from '../../types';
import { getMarkerId } from '@xyflow/system';
import { computed } from 'vue';
import { storeToRefs, useStore, useVueFlow } from '../../composables';
import MarkerSymbols from './MarkerSymbols.vue';

const { id: vueFlowId } = useVueFlow();

const { edges, connectionLineOptions, defaultEdgeOptions, defaultMarkerColor: defaultColor } = storeToRefs(useStore());

const markers = computed(() => {
  const ids: Set<string> = new Set();
  const markers: MarkerProps[] = [];

  const createMarkers = (marker?: EdgeMarkerType) => {
    if (marker) {
      const markerId = getMarkerId(marker, vueFlowId);

      if (!ids.has(markerId)) {
        if (typeof marker === 'object') {
          markers.push({ ...marker, id: markerId, color: marker.color || defaultColor.value });
        }
        else {
          markers.push({ id: markerId, color: defaultColor.value, type: marker as MarkerType });
        }

        ids.add(markerId);
      }
    }
  };

  for (const marker of [connectionLineOptions.value.markerEnd, connectionLineOptions.value.markerStart]) {
    createMarkers(marker);
  }

  for (const edge of edges.value) {
    // defaults are not stamped onto stored edges — resolve markers through defaultEdgeOptions at read time
    for (const marker of [
      edge.markerStart ?? defaultEdgeOptions.value?.markerStart,
      edge.markerEnd ?? defaultEdgeOptions.value?.markerEnd,
    ]) {
      createMarkers(marker);
    }
  }

  return markers.sort((a, b) => a.id.localeCompare(b.id));
});
</script>

<script lang="ts">
export default {
  name: 'MarkerDefinitions',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <svg class="vue-flow__marker vue-flow__container" aria-hidden="true">
    <defs>
      <MarkerSymbols
        v-for="marker of markers"
        :id="marker.id"
        :key="marker.id"
        :type="marker.type"
        :color="marker.color"
        :width="marker.width"
        :height="marker.height"
        :markerUnits="marker.markerUnits"
        :stroke-width="marker.strokeWidth"
        :orient="marker.orient"
      />
    </defs>
  </svg>
</template>

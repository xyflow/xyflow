<script lang="ts" setup>
import { storeToRefs, useStore, useVueFlow } from '../../composables';
import { ARIA_EDGE_DESC_KEY, ARIA_LIVE_MESSAGE, ARIA_NODE_DESC_KEY } from '../../utils/a11y';

const { id } = useVueFlow();
const { disableKeyboardA11y, ariaLiveMessage, ariaLabelConfig } = storeToRefs(useStore());
</script>

<script lang="ts">
export default {
  name: 'A11yDescriptions',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <div :id="`${ARIA_NODE_DESC_KEY}-${id}`" style="display: none">
    {{
      disableKeyboardA11y
        ? ariaLabelConfig['node.a11yDescription.default']
        : ariaLabelConfig['node.a11yDescription.keyboardDisabled']
    }}
  </div>

  <div :id="`${ARIA_EDGE_DESC_KEY}-${id}`" style="display: none">
    {{ ariaLabelConfig['edge.a11yDescription.default'] }}
  </div>

  <div
    v-if="!disableKeyboardA11y"
    :id="`${ARIA_LIVE_MESSAGE}-${id}`"
    aria-live="assertive"
    aria-atomic="true"
    style="
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      border: 0;
      padding: 0;
      overflow: hidden;
      clip: rect(0px, 0px, 0px, 0px);
      clip-path: inset(100%);
    "
  >
    {{ ariaLiveMessage }}
  </div>
</template>

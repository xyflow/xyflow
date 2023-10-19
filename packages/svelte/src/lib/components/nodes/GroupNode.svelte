<script lang="ts">
  import type { NodeProps } from '@xyflow/system';

  interface $$Props extends NodeProps<{}> {}

  // unused props - we need to list them here in order to prevent warnings
  export let id: $$Props['id'] = '';
  export let data: $$Props['data'] = {};
  export let selected: $$Props['selected'] = undefined;
  export let sourcePosition: $$Props['sourcePosition'] = undefined;
  export let targetPosition: $$Props['targetPosition'] = undefined;
  export let type: $$Props['type'] = undefined;
  export let zIndex: $$Props['zIndex'] = undefined;
  export let dragging: $$Props['dragging'] = false;
  export let dragHandle: $$Props['dragHandle'] = undefined;
  export let xPos: $$Props['xPos'] = 0;
  export let yPos: $$Props['yPos'] = 0;
  export let isConnectable: $$Props['isConnectable'] = undefined;
</script>

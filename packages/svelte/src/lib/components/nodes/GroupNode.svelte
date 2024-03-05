<script lang="ts">
  import type { NodeProps } from '$lib/types';

  interface $$Props extends NodeProps {}

  // unused props - we need to list them here in order to prevent warnings
  export let id: $$Props['id'] = '';
  export let width: $$Props['width'] = undefined;
  export let height: $$Props['height'] = undefined;
  export let data: $$Props['data'] = {};
  export let selected: $$Props['selected'] = undefined;
  export let sourcePosition: $$Props['sourcePosition'] = undefined;
  export let targetPosition: $$Props['targetPosition'] = undefined;
  export let type: $$Props['type'] = undefined;
  export let dragging: $$Props['dragging'] = false;
  export let dragHandle: $$Props['dragHandle'] = undefined;
  export let positionAbsoluteX: $$Props['positionAbsoluteX'] = 0;
  export let positionAbsoluteY: $$Props['positionAbsoluteY'] = 0;
  export let isConnectable: $$Props['isConnectable'];
  export let zIndex: $$Props['zIndex'];

  // @todo: there must be a better way to do this
  id;
  width;
  height;
  data;
  selected;
  sourcePosition;
  targetPosition;
  type;
  zIndex;
  dragging;
  dragHandle;
  positionAbsoluteX;
  positionAbsoluteY;
  isConnectable;
</script>

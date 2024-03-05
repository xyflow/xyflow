<script lang="ts">
  import { Position } from '@xyflow/system';
  import type { NodeProps } from '$lib/types';

  import { Handle } from '$lib/components/Handle';

  interface $$Props extends NodeProps {}

  export let data: $$Props['data'] = { label: 'Node' };
  export let targetPosition: $$Props['targetPosition'] = Position.Top;

  // unused props - we need to list them here in order to prevent warnings
  export let id: $$Props['id'] = '';
  export let width: $$Props['width'] = undefined;
  export let height: $$Props['height'] = undefined;
  export let selected: $$Props['selected'] = undefined;
  export let sourcePosition: $$Props['sourcePosition'] = undefined;
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
  selected;
  sourcePosition;
  type;
  zIndex;
  dragging;
  dragHandle;
  positionAbsoluteX;
  positionAbsoluteY;
  isConnectable;
</script>

{data?.label}
<Handle type="target" position={targetPosition} />

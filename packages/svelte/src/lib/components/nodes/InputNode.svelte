<script lang="ts">
  import { Position, type NodeProps } from '@xyflow/system';

  import { Handle } from '$lib/components/Handle';

  interface $$Props extends NodeProps<{ label: string }> {}

  export let data: $$Props['data'] = { label: 'Node' };
  export let sourcePosition: $$Props['sourcePosition'] = Position.Bottom;

  // unused props - we need to list them here in order to prevent warnings
  export let id: $$Props['id'] = '';
  export let width: $$Props['width'] = undefined;
  export let height: $$Props['height'] = undefined;
  export let selected: $$Props['selected'] = undefined;
  export let targetPosition: $$Props['targetPosition'] = undefined;
  export let type: $$Props['type'] = undefined;
  export let zIndex: $$Props['zIndex'] = undefined;
  export let dragging: $$Props['dragging'] = false;
  export let dragHandle: $$Props['dragHandle'] = undefined;
  export let positionAbsoluteX: $$Props['positionAbsoluteX'] = 0;
  export let positionAbsoluteY: $$Props['positionAbsoluteY'] = 0;
  export let isConnectable: $$Props['isConnectable'] = undefined;

  // @todo: there must be a better way to do this
  id;
  width;
  height;
  selected;
  targetPosition;
  type;
  zIndex;
  dragging;
  dragHandle;
  positionAbsoluteX;
  positionAbsoluteY;
  isConnectable;
</script>

{data?.label}
<Handle type="source" position={sourcePosition} />

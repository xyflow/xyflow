<script lang="ts">
  import { Position, type NodeProps } from '@xyflow/system';

  import { Handle } from '$lib/components/Handle';

  interface $$Props extends NodeProps<{ label: string }> {}

  export let data: $$Props['data'] = { label: 'Node' };
  export let sourcePosition: $$Props['sourcePosition'] = Position.Bottom;

  // unused props - we need to list them here in order to prevent warnings
  export let id: $$Props['id'] = '';
  export let selected: $$Props['selected'] = undefined;
  export let targetPosition: $$Props['targetPosition'] = undefined;
  export let type: $$Props['type'] = undefined;
  export let zIndex: $$Props['zIndex'] = undefined;
  export let dragging: $$Props['dragging'] = false;
  export let dragHandle: $$Props['dragHandle'] = undefined;
  export let xPos: $$Props['xPos'] = 0;
  export let yPos: $$Props['yPos'] = 0;
  export let isConnectable: $$Props['isConnectable'] = undefined;

  // @todo: there must be a better way to do this
  id;
  selected;
  targetPosition;
  type;
  zIndex;
  dragging;
  dragHandle;
  xPos;
  yPos;
  isConnectable;
</script>

{data?.label}
<Handle type="source" position={sourcePosition} on:connectstart on:connect on:connectend />

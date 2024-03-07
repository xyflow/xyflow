<script lang="ts">
  import { getSmoothStepPath } from '@xyflow/system';

  import type { EdgeProps } from '$lib/types';
  import { BaseEdge } from '$lib/components/BaseEdge';

  type $$Props = EdgeProps;

  // these props are not used in this edge, but passed to every custom edge component
  export let id: $$Props['id'] = '';
  export let source: $$Props['source'] = '';
  export let target: $$Props['target'] = '';
  export let type: $$Props['type'] = 'step';

  export let animated: $$Props['animated'] = undefined;
  export let selected: $$Props['selected'] = undefined;
  export let label: $$Props['label'] = undefined;
  export let data: $$Props['data'] = undefined;
  export let labelStyle: $$Props['labelStyle'] = undefined;
  export let style: $$Props['style'] = undefined;
  export let markerStart: $$Props['markerStart'] = undefined;
  export let markerEnd: $$Props['markerEnd'] = undefined;
  export let interactionWidth: $$Props['interactionWidth'] = undefined;

  export let sourceX: $$Props['sourceX'];
  export let sourceY: $$Props['sourceY'];
  export let sourcePosition: $$Props['sourcePosition'];
  export let sourceHandleId: $$Props['sourceHandleId'] = undefined;

  export let targetX: $$Props['targetX'];
  export let targetY: $$Props['targetY'];
  export let targetPosition: $$Props['targetPosition'];
  export let targetHandleId: $$Props['targetHandleId'] = undefined;

  $: [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 0
  });

  id;
  source;
  target;
  type;
  animated;
  selected;
  data;
  sourceHandleId;
  targetHandleId;
</script>

<BaseEdge
  {path}
  {labelX}
  {labelY}
  {label}
  {labelStyle}
  {markerStart}
  {markerEnd}
  {interactionWidth}
  {style}
/>

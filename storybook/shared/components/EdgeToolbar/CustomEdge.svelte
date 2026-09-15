<script lang="ts">
  import {
    getBezierPath,
    getStraightPath,
    getSmoothStepPath,
    BaseEdge,
    EdgeToolbar,
    useSvelteFlow,
    type Edge,
    type EdgeProps,
  } from '@xyflow/svelte';
  type ToolbarEdge = Edge<{ type: string; align: ['left' | 'center' | 'right', 'top' | 'center' | 'bottom'] }>;
  let props: EdgeProps<ToolbarEdge> = $props();
  const { deleteElements } = useSvelteFlow();
  let path = $derived(
    (props.data?.type === 'smoothstep'
      ? getSmoothStepPath
      : props.data?.type === 'straight'
        ? getStraightPath
        : getBezierPath)(props)
  );
</script>

<BaseEdge id={props.id} path={path[0]} />
<EdgeToolbar
  x={path[1]}
  y={path[2]}
  alignX={props.data?.align?.[0] ?? 'center'}
  alignY={props.data?.align?.[1] ?? 'center'}
  isVisible
>
  <button onclick={() => deleteElements({ edges: [{ id: props.id }] })}>Delete</button>
</EdgeToolbar>

<script lang="ts">
  import { getBezierPath } from '@xyflow/system';

  import { BaseEdge, EdgeLabelRenderer, useSvelteFlow, type EdgeProps } from '../../../lib/index';

  type $$Props = EdgeProps;

  $: [path, labelX, labelY] = getBezierPath({
    sourceX: $$props.sourceX,
    sourceY: $$props.sourceY,
    targetX: $$props.targetX,
    targetY: $$props.targetY,
    sourcePosition: $$props.sourcePosition,
    targetPosition: $$props.targetPosition
  });

  const svelteFlow = useSvelteFlow();

  function onClick() {
    svelteFlow.edges.update((eds) => eds.filter((e) => e.id !== $$props.id));
  }
</script>

<BaseEdge {path} {labelX} {labelY} {...$$props} />

<EdgeLabelRenderer>
  <button
    style:transform={`translate(-50%,-50%) translate(${labelX}px,${labelY}px)`}
    class="edge-button"
    on:click={onClick}
  >
    ✕
  </button>
</EdgeLabelRenderer>

<style>
  .edge-button {
    border-radius: 50%;
    position: absolute;
    border: none;
    width: 1rem;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 8px;
    pointer-events: all;
    cursor: pointer;
    background-color: #eee;
  }

  .edge-button:hover {
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.12);
  }
</style>

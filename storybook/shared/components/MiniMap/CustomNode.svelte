<script lang="ts">
  import type { MiniMapNodeProps } from '@xyflow/svelte';
  let { x, y, width, height, selected }: MiniMapNodeProps = $props();
</script>

<circle
  cx={x + width / 2}
  cy={y + height / 2}
  r={Math.max(1, Math.min(width, height) / 2)}
  fill={selected ? '#ff6b6b' : '#ffcc00'}
/>

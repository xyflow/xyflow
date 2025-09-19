<script lang="ts">
  import { SvelteFlowProvider } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  import BasicFlowInner from './BasicFlowInner.svelte';
  
  // Import shared types
  import type { BasicFlowProps } from '../../shared/basic-stories';

  // Props for the main component
  let {
    nodeDragThreshold = 0,
    classNames = 'light',
    isHidden = 'visible',
    onNodeDrag = () => {},
    onNodeDragStart = () => {},
    onNodeDragStop = () => {},
    onNodeClick = () => {},
  }: BasicFlowProps = $props();
</script>

<div style="width: 100%; height: 95vh;">
  <SvelteFlowProvider>
    <BasicFlowInner 
      {nodeDragThreshold}
      {classNames}
      {isHidden}
      {onNodeDrag}
      {onNodeDragStart}
      {onNodeDragStop}
      {onNodeClick}
    />
  </SvelteFlowProvider>
</div>

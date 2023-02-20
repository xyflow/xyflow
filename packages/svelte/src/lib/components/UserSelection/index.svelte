<script lang="ts">
  import { useStore } from '$lib/store';
  import Selection from '$lib/components/Selection/index.svelte';

  const { selectionRectStore, selectionRectModeStore } = useStore();
</script> 

<Selection
  isVisible={!!($selectionRectStore && $selectionRectModeStore === 'user')}
  width={$selectionRectStore?.width}
  height={$selectionRectStore?.height}
  x={$selectionRectStore?.x}
  y={$selectionRectStore?.y}
/>

<script lang="ts">
  import { useStore } from '$lib/store';
  import { Selection } from '$lib/components/Selection';

  const { selectionRect, selectionRectMode } = useStore();
</script>

<Selection
  isVisible={!!($selectionRect && $selectionRectMode === 'user')}
  width={$selectionRect?.width}
  height={$selectionRect?.height}
  x={$selectionRect?.x}
  y={$selectionRect?.y}
/>

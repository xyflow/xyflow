<script lang="ts">
  import { useStore } from '$lib/store';
  import { Selection } from '$lib/components/Selection';

  const store = useStore();
</script>

<Selection
  isVisible={!!(store.selectionRect && store.selectionRectMode === 'user')}
  width={store.selectionRect?.width}
  height={store.selectionRect?.height}
  x={store.selectionRect?.x}
  y={store.selectionRect?.y}
/>

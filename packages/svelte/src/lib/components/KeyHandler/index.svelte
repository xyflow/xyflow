<script lang="ts">
  import { shortcut } from '@svelte-put/shortcut';

  import { useStore } from '$lib/store';

  const { selectionKeyPressedStore } = useStore();

  function onSelectionKeyDown() {
    selectionKeyPressedStore.set(true);
  }

  function onSelectionKeyUp() {
    selectionKeyPressedStore.set(false);
  }
</script>

<svelte:window
  use:shortcut={{ 
    trigger: [{ key: 'Shift', callback: onSelectionKeyDown }],
    type: 'keydown'
  }}
  use:shortcut={{ 
    trigger: [{ key: 'Shift', callback: onSelectionKeyUp }],
    type: 'keyup'
  }}
/>

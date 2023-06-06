<script lang="ts">
  import { onDestroy } from 'svelte';

  import { createStoreContext } from '$lib/store';

  const store = createStoreContext();

  onDestroy(() => {
    store.reset();
  });
</script>

<slot />

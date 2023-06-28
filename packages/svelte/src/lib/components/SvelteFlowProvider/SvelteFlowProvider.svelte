<script lang="ts">
  import { onDestroy, setContext } from 'svelte';

  import { createStore, key } from '$lib/store';

  const store = createStore();

  setContext(key, {
    getStore: () => store
  });

  onDestroy(() => {
    store.reset();
  });
</script>

<slot />

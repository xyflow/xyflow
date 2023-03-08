<script lang="ts">
  import { setContext } from 'svelte';
  
  import { createStore, key } from '$lib/store';

  const store = createStore();

  setContext(key, {
    getStore: () => store
  });
</script>

<slot />

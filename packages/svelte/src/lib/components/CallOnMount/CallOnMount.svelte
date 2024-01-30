<script lang="ts">
  import { onMount } from 'svelte';

  let _onMount: (() => void) | undefined = undefined;
  export { _onMount as onMount };

  let _onDestroy: (() => void) | undefined = undefined;
  export { _onDestroy as onDestroy };

  onMount(() => {
    _onMount?.();
    return _onDestroy;
  });
</script>

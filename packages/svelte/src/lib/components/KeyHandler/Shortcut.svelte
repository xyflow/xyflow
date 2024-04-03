<script lang="ts">
  import { onMount } from 'svelte';
  import {
    shortcut,
    type ShortcutActionReturn,
    type ShortcutParameters
  } from '@svelte-put/shortcut';

  export let options: ShortcutParameters;
  export let domNode: HTMLElement | null = null;

  let handler: ShortcutActionReturn | null = null;
  $: {
    if (domNode) {
      if (!handler) {
        handler = shortcut(domNode, options);
      } else if (handler.update) {
        handler.update(options);
      }
    }
  }

  onMount(() => {
    return () => {
      if (handler?.destroy) {
        handler.destroy();
      }
    };
  });
</script>

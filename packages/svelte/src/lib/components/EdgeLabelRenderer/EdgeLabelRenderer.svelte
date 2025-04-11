<script lang="ts">
  import type { Snippet } from 'svelte';
  import { portal } from '$lib/actions/portal';

  let { children }: { children?: Snippet } = $props();
</script>

<div use:portal={'edgelabel'}>
  {@render children?.()}
</div>

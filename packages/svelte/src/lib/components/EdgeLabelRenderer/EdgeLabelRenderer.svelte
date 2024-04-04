<script lang="ts">
  import portal from '$lib/actions/portal';
  import { useStore } from '$lib/store';

  const { domNode } = useStore();
</script>

<div use:portal={{ target: '.svelte-flow__edgelabel-renderer', domNode: $domNode }}>
  <slot />
</div>

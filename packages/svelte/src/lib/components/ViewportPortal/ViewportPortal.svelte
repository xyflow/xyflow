<script lang="ts">
  import portal from '$lib/actions/portal';
  import { useStore } from '$lib/store';

  type $$Props = {};

  const { domNode } = useStore();
</script>

<div use:portal={{ target: '.svelte-flow__viewport-portal', domNode: $domNode }}>
  <slot />
</div>

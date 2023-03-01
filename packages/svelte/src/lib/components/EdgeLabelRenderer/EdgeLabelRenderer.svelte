<script lang="ts">
  import portal from '$lib/actions/portal';

  type $$Props = {};
</script>

<div use:portal={'.react-flow__edgelabel-renderer'}>
  <slot />
</div>

<!-- storybook/svelte/.storybook/DecoratorWrapper.svelte -->
<script lang="ts">
  export let story: { Component: any; props?: any };
</script>

<div style="width: 100vw; height: 100vh; margin: 0; padding: 0;">
  <svelte:component this={story.Component} {...story.props} />
</div>

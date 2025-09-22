<!-- storybook/svelte/.storybook/DecoratorWrapper.svelte -->
<script lang="ts">
    import { SvelteFlowProvider } from '@xyflow/svelte';
    export let story: { Component: any; props?: any };
  </script>
  
  <div style="width: 100%; height: 95vh; margin: 0; padding: 0;">
    <SvelteFlowProvider>
      <svelte:component this={story.Component} {...story.props} />
    </SvelteFlowProvider>
  </div>
<script lang="ts">
  import { onMount } from 'svelte';
  import { Panel, SvelteFlow, type ColorMode } from '@xyflow/svelte';

  import { colorModeSvelteConfig } from 'storybook-shared/flow-configs/color-mode';
  import { FLOW_STORY_RESET_EVENT } from 'storybook-shared/play-helpers/suite';

  type PageTheme = 'system' | ColorMode;

  let pageTheme = $state<PageTheme>('system');
  let nodes = $state.raw([...(colorModeSvelteConfig.flowProps?.nodes ?? [])]);
  let edges = $state.raw([...(colorModeSvelteConfig.flowProps?.edges ?? [])]);
  let resetKey = $state(0);

  onMount(() => {
    const reset = () => {
      pageTheme = 'system';
      document.documentElement.removeAttribute('data-theme');
      nodes = [...(colorModeSvelteConfig.flowProps?.nodes ?? [])];
      edges = [...(colorModeSvelteConfig.flowProps?.edges ?? [])];
      resetKey += 1;
    };

    window.addEventListener(FLOW_STORY_RESET_EVENT, reset);
    return () => window.removeEventListener(FLOW_STORY_RESET_EVENT, reset);
  });

  function updatePageTheme(value: PageTheme) {
    pageTheme = value;

    if (value === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', value);
    }
  }
</script>

<div class="flow-story">
  {#key resetKey}
    <SvelteFlow {...colorModeSvelteConfig.flowProps} bind:nodes bind:edges>
      <Panel position="top-right">
        <label>
          Page theme (html data-theme)
          <select
            value={pageTheme}
            onchange={(event) => updatePageTheme(event.currentTarget.value as PageTheme)}
            data-testid="colormode-select"
          >
            <option value="system">system</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
      </Panel>
    </SvelteFlow>
  {/key}
</div>

<style>
  .flow-story {
    width: 100%;
    height: 100%;
  }
</style>
